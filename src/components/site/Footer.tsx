import { Instagram, MapPin, Phone } from "lucide-react";
import { Link } from "react-router";
import {
  ADDRESS,
  BRAND_TAGLINE,
  PHONE_DISPLAY,
  PHONE_TEL,
  TIKTOK_HANDLE,
  WA_GENERAL,
} from "@/lib/site";
import { TikTokIcon, WhatsAppIcon } from "./icons";
import { LogoMark } from "./SiteLogo";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "Inventory", to: "/inventory" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy Policy", to: "/privacy" },
];

const CATEGORY_LINKS = [
  { label: "SUVs", to: "/inventory?type=SUV" },
  { label: "Sedans", to: "/inventory?type=Sedan" },
  { label: "Luxury / Coupe", to: "/inventory?type=Luxury" },
  { label: "Trucks", to: "/inventory?type=Truck" },
  { label: "Electric / Hybrid", to: "/inventory?type=Electric" },
  { label: "View All Machines", to: "/inventory" },
];

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#070707]">
      <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <LogoMark size={40} />
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-black tracking-[0.06em] text-white">
                SARKIN <span className="text-gold">MOTA</span>
              </span>
              <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-[#888]">
                Autos · Abuja
              </span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[#a8a8a8]">
            {BRAND_TAGLINE} Nigeria&apos;s home of premium foreign used
            machines — Carfax verified, 150-point inspected, delivered to all
            36 states.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.tiktok.com/@sarkinmota"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Sarkin Mota on TikTok ${TIKTOK_HANDLE}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[#d8d8d8] transition-all hover:-translate-y-1 hover:border-gold/60 hover:text-gold"
            >
              <TikTokIcon className="h-4 w-4" />
            </a>
            <a
              href="https://www.instagram.com/sarkinmota"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Sarkin Mota on Instagram ${TIKTOK_HANDLE}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[#d8d8d8] transition-all hover:-translate-y-1 hover:border-gold/60 hover:text-gold"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={WA_GENERAL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Sarkin Mota on WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[#d8d8d8] transition-all hover:-translate-y-1 hover:border-[#25d366]/60 hover:text-[#25d366]"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <nav aria-label="Quick links">
          <h3 className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-gold">
            Quick Links
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {QUICK_LINKS.map((l) => (
              <li key={l.to + l.label}>
                <Link
                  to={l.to}
                  className="text-sm text-[#a8a8a8] transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Categories */}
        <nav aria-label="Inventory categories">
          <h3 className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-gold">
            Inventory
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {CATEGORY_LINKS.map((l) => (
              <li key={l.to + l.label}>
                <Link
                  to={l.to}
                  className="text-sm text-[#a8a8a8] transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-gold">
            Visit the Showroom
          </h3>
          <p className="flex items-start gap-2.5 text-sm text-[#a8a8a8]">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            {ADDRESS}
          </p>
          <a
            href={`tel:${PHONE_TEL}`}
            className="flex items-center gap-2.5 text-sm font-semibold text-[#d8d8d8] transition-colors hover:text-gold"
          >
            <Phone className="h-4 w-4 shrink-0 text-gold" />
            {PHONE_DISPLAY}
          </a>
          <p className="text-sm text-[#a8a8a8]">
            Mon–Sat: 8AM – 6PM · WhatsApp 7 days
          </p>
          <iframe
            title="Sarkin Mota Autos showroom location"
            src="https://www.google.com/maps?q=Olusegun%20Obasanjo%20Way%2C%20Central%20Business%20District%2C%20Abuja%2C%20Nigeria&output=embed"
            loading="lazy"
            className="mt-1 h-28 w-full rounded-xl border border-white/10 grayscale"
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-5 text-xs text-[#777] sm:flex-row">
          <p>
            © {YEAR} Sarkin Mota Autos — My Bratha 👑
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="transition-colors hover:text-gold">
              Privacy
            </Link>
            <Link to="/contact" className="transition-colors hover:text-gold">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
