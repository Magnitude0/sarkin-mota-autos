import { Crown, X } from "lucide-react";
import { useEffect } from "react";
import type { Car } from "./CarCard";
import { LeadForm } from "./LeadForm";

export function InquireModal({
  car,
  open,
  onClose,
}: {
  car: Car | null;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !car) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Inquire about ${car.title}`}
      className="fixed inset-0 z-[1500] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[20px] border border-gold/20 bg-[#151517] p-7 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        style={{ transform: "none" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close inquiry form"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-[#bbb] transition-colors hover:border-gold/50 hover:text-gold"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 flex items-center gap-3 pr-8">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/40 bg-gold/10">
            <Crown className="h-5 w-5 text-gold" fill="currentColor" strokeWidth={1.2} />
          </span>
          <div>
            <h3 className="font-display text-lg font-black text-white">
              Inquire About This Machine
            </h3>
            <p className="text-xs text-[#888]">
              My Bratha replies fast — usually within minutes.
            </p>
          </div>
        </div>

        <LeadForm machine={car.title} submitLabel="Send Inquiry 👑" compact />
      </div>
    </div>
  );
}
