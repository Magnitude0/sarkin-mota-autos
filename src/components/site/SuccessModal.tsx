import { Crown, X } from "lucide-react";
import { useEffect } from "react";
import { WhatsAppIcon } from "./icons";

export function SuccessModal({
  open,
  onClose,
  waHref,
}: {
  open: boolean;
  onClose: () => void;
  waHref?: string;
}) {
  // Auto-open WhatsApp with the pre-filled message 0.8s after submission
  useEffect(() => {
    if (open && waHref) {
      const t = setTimeout(() => window.open(waHref, "_blank"), 800);
      return () => clearTimeout(t);
    }
  }, [open, waHref]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Message sent"
      className="fixed inset-0 z-[1500] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md rounded-[20px] border border-gold/20 bg-[#1c1c1e] p-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        style={{ transform: "none" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-[#bbb] transition-colors hover:border-gold/50 hover:text-gold"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
          <Crown className="h-8 w-8 text-gold" fill="currentColor" strokeWidth={1.2} />
        </span>
        <h3 className="mt-5 font-display text-2xl font-black leading-snug text-white">
          Message Sent! <span className="text-gold">My Bratha</span> Will Reply
          Shortly
        </h3>
        <p className="mt-3 text-sm text-[#a8a8a8]">
          Your details are with the Sarkin Mota team. Keep your phone close —
          and while you wait, say hello on WhatsApp.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa btn-block"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Open WhatsApp
          </a>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline-gold btn-block"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
