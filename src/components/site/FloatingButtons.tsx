import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { WA_GENERAL } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

export function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 350);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* WhatsApp float */}
      <a
        href={WA_GENERAL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Sarkin Mota on WhatsApp"
        className="fixed bottom-6 right-6 z-[900] flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_8px_28px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 hover:shadow-[0_10px_36px_rgba(37,211,102,0.6)]"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>

      {/* Back to top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={cn(
          "fixed bottom-[6.5rem] right-6 z-[900] flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-[#1c1c1e] text-gold shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 hover:bg-gold hover:text-black",
          showTop ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  );
}
