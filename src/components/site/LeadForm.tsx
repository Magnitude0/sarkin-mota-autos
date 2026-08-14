import { Crown, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { buildInquiryMsg, waLink } from "@/lib/site";
import { SuccessModal } from "./SuccessModal";

interface LeadFormProps {
  /** Readonly machine name (inquire modal) */
  machine?: string;
  /** Dropdown options for machine of interest */
  machineOptions?: string[];
  /** Free-text machine interest field (contact page) */
  machineText?: boolean;
  /** Optional extra field label for the machine selector */
  machineLabel?: string;
  submitLabel?: string;
  compact?: boolean;
}

export function LeadForm({
  machine,
  machineOptions,
  machineText = false,
  machineLabel = "Machine of Interest",
  submitLabel = "Send Lead 👑",
  compact = false,
}: LeadFormProps) {
  const saveLead = useMutation(api.inquiries.create);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [machineValue, setMachineValue] = useState(machine ?? "");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [waHref, setWaHref] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Name and phone number are required, my bratha.");
      return;
    }
    if (!consent) {
      setError("Please tick the consent box so we can contact you.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await saveLead({
        name: name.trim(),
        phone: phone.trim(),
        carInterest: machineValue.trim() || undefined,
        message: message.trim() || undefined,
      });
      setWaHref(
        waLink(
          buildInquiryMsg({
            name: name.trim(),
            phone: phone.trim(),
            machine: machineValue.trim(),
            message: message.trim(),
          }),
        ),
      );
      setSent(true);
      setName("");
      setPhone("");
      setMachineValue(machine ?? "");
      setMessage("");
      setConsent(false);
    } catch {
      setError("Could not send — please try again or WhatsApp us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red/40 bg-red/10 px-4 py-3 text-sm text-[#ff8b97]"
          >
            {error}
          </p>
        )}

        <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
          <div>
            <label htmlFor="lf-name" className="field-label">
              Full Name *
            </label>
            <input
              id="lf-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aminu Ibrahim"
              autoComplete="name"
              className="input-dark"
              disabled={submitting}
            />
          </div>
          <div>
            <label htmlFor="lf-phone" className="field-label">
              Phone *
            </label>
            <input
              id="lf-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0803 123 4567"
              autoComplete="tel"
              className="input-dark"
              disabled={submitting}
            />
          </div>
        </div>

        {machine !== undefined ? (
          <div>
            <label htmlFor="lf-machine" className="field-label">
              Machine
            </label>
            <input
              id="lf-machine"
              type="text"
              value={machine}
              readOnly
              className="input-dark cursor-not-allowed opacity-80"
              aria-label="Selected machine"
            />
          </div>
        ) : machineOptions ? (
          <div>
            <label htmlFor="lf-machine-sel" className="field-label">
              {machineLabel}
            </label>
            <select
              id="lf-machine-sel"
              value={machineValue}
              onChange={(e) => setMachineValue(e.target.value)}
              className="select-dark"
              disabled={submitting}
            >
              <option value="">Select a machine (optional)</option>
              {machineOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        ) : machineText ? (
          <div>
            <label htmlFor="lf-machine-text" className="field-label">
              {machineLabel}
            </label>
            <input
              id="lf-machine-text"
              type="text"
              value={machineValue}
              onChange={(e) => setMachineValue(e.target.value)}
              placeholder="e.g. Toyota Land Cruiser 2019"
              className="input-dark"
              disabled={submitting}
            />
          </div>
        ) : null}

        <div>
          <label htmlFor="lf-message" className="field-label">
            Message <span className="normal-case text-[#666]">(optional)</span>
          </label>
          <textarea
            id="lf-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell My Bratha what you're looking for…"
            rows={compact ? 3 : 4}
            className="textarea-dark resize-none"
            disabled={submitting}
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-[#b8b8b8]">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={submitting}
            className="mt-1 h-4 w-4 shrink-0 accent-[#ffd700]"
            aria-label="Consent to be contacted"
          />
          <span>
            I agree to be contacted by Sarkin Mota Autos about my enquiry. Your
            details are never shared.
          </span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-red btn-block disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Crown className="h-4 w-4" />
              {submitLabel}
            </>
          )}
        </button>
      </form>

      <SuccessModal
        open={sent}
        onClose={() => setSent(false)}
        waHref={waHref || undefined}
      />
    </>
  );
}
