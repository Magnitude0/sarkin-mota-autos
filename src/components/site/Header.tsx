import { Crown, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { PHONE_DISPLAY, PHONE_TEL, WA_GENERAL } from "@/lib/site";
import { WhatsAppIcon } from "./icons";
import { SiteLogo } from "./SiteLogo";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Inventory", to: "/inventory" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation + lock body scroll while open
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[1000] h-[76px] transition-shadow duration-300",
          scrolled ? "shadow-[0_4px_32px_rgba(0,0,0,0.6)]" : "",
        )}
        style={{
          background: "rgba(10,10,10,0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="container-site flex h-full items-center justify-between gap-4">
          <SiteLogo />

          {/* Desktop nav */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 lg:flex"
          >
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative px-4 py-2 font-display text-[0.82rem] font-bold uppercase tracking-[0.12em] transition-colors",
                  isActive(item.to)
                    ? "text-gold"
                    : "text-[#d8d8d8] hover:text-white",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gold transition-opacity",
                    isActive(item.to) ? "opacity-100" : "opacity-0",
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${PHONE_TEL}`}
              className="hidden items-center gap-2 text-sm font-semibold text-[#e8e8e8] transition-colors hover:text-gold xl:flex"
              aria-label={`Call us on ${PHONE_DISPLAY}`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                <Phone className="h-3.5 w-3.5 text-gold" />
              </span>
              {PHONE_DISPLAY}
            </a>

            <a
              href={WA_GENERAL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold btn-sm hidden sm:inline-flex"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat My Bratha
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white transition-colors hover:border-gold/50 hover:text-gold lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
        className={cn(
          "fixed inset-0 z-[1100] bg-black/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Mobile slide-in menu */}
      <aside
        aria-label="Mobile menu"
        className={cn(
          "fixed right-0 top-0 z-[1200] flex h-full w-[300px] max-w-[85vw] flex-col bg-[#111] shadow-[0_0_60px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out lg:hidden",
          menuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <SiteLogo compact />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white transition-colors hover:border-gold/50 hover:text-gold"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Mobile navigation" className="flex flex-col p-4">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center justify-between rounded-xl px-4 py-3.5 font-display text-sm font-bold uppercase tracking-[0.12em] transition-colors",
                isActive(item.to)
                  ? "bg-gold/10 text-gold"
                  : "text-[#d8d8d8] hover:bg-white/5 hover:text-white",
              )}
            >
              {item.label}
              <Crown className="h-3.5 w-3.5 text-gold/60" />
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3 border-t border-white/10 p-5">
          <a
            href={WA_GENERAL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa btn-block"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Chat My Bratha
          </a>
          <a href={`tel:${PHONE_TEL}`} className="btn btn-outline-white btn-block">
            <Phone className="h-4 w-4" />
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </aside>
    </>
  );
}
