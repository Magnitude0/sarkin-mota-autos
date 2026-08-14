import {
  ArrowRight,
  Banknote,
  Building2,
  Globe,
  Headset,
  Phone,
  RefreshCw,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { WhatsAppIcon } from "@/components/site/icons";
import { PHONE_DISPLAY, PHONE_TEL, WA_GENERAL } from "@/lib/site";

const SERVICES = [
  {
    icon: Banknote,
    title: "Flexible 40% Deposit Plans",
    text: "Walk in with 40% and drive out today. 6–36 month repayment built around your cash flow.",
    bullets: ["6–36 month repayment", "No hidden charges", "Transparent terms in writing"],
  },
  {
    icon: Globe,
    title: "Custom USA / Europe Sourcing",
    text: "Direct access to US Dealer Auctions, European showrooms and Canadian dealers.",
    bullets: ["Carfax provided on request", "Port to door handling", "Customs clearing included"],
  },
  {
    icon: ShieldCheck,
    title: "150-Point Pre-Sale Inspection",
    text: "Every machine passes a full mechanical & electrical diagnostic before it reaches the floor.",
    bullets: ["Full diagnostics report", "Verified Carfax", "Zero mileage tampering"],
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    text: "Enclosed flatbed delivery to all 36 Nigerian states with live WhatsApp updates.",
    bullets: ["All 36 states covered", "Enclosed flatbed transport", "Step-by-step WhatsApp updates"],
  },
  {
    icon: RefreshCw,
    title: "Trade-In & Upgrade",
    text: "Your current machine counts toward your next one. Honest valuation, direct offset.",
    bullets: ["Honest market valuation", "Value offset directly", "Photo assessment via WhatsApp"],
  },
  {
    icon: Wrench,
    title: "Sell Your Machine",
    text: "Need cash fast? We buy clean machines with a 24-hour valuation and fast payment.",
    bullets: ["24-hour valuation", "Honest market price", "Fast, reliable payment"],
  },
  {
    icon: Headset,
    title: "After-Sales Support",
    text: "The relationship doesn't end at delivery. We stay on your line after you drive away.",
    bullets: ["Post-purchase WhatsApp line", "Trusted mechanic referrals", "Documentation support"],
  },
  {
    icon: Building2,
    title: "Corporate Fleet Acquisition",
    text: "Outfit your business with a premium fleet at bulk pricing with corporate payment terms.",
    bullets: ["Bulk pricing", "Corporate payment terms", "Dedicated account manager"],
  },
];

export default function Services() {
  return (
    <SiteLayout>
      <PageHero
        label="What We Do"
        title={
          <>
            More Than Just Selling{" "}
            <span className="text-gold">Machines</span> 👑
          </>
        }
        sub="From the first WhatsApp message to years after delivery, Sarkin Mota Autos handles the entire machine lifecycle — for individuals and businesses alike."
      />

      <section className="py-14 sm:py-20">
        <div className="container-site">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={(i % 4) * 0.08}>
                <article
                  className="card-dark flex h-full flex-col border-l-4 border-l-gold p-6"
                  style={{ transform: "none" }}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/40 bg-gold/10">
                    <s.icon className="h-6 w-6 text-gold" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-extrabold leading-snug text-white">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#a8a8a8]">
                    {s.text}
                  </p>
                  <ul className="mt-4 flex flex-col gap-2 text-sm text-[#c8c8c8]">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={WA_GENERAL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 pt-5 font-display text-sm font-bold text-gold transition-colors hover:text-gold-dark"
                  >
                    Enquire <ArrowRight className="h-4 w-4" />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-20">
        <div className="container-site">
          <Reveal>
            <div
              className="rounded-[20px] border border-gold/25 bg-[#151515] p-10 text-center shadow-[0_8px_40px_rgba(0,0,0,0.5)] sm:p-14"
              style={{ transform: "none" }}
            >
              <h2 className="h-display text-[clamp(1.6rem,3.5vw,2.6rem)] text-white">
                Which Service Do You Need? <span className="text-gold">👑</span>
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[#a8a8a8]">
                Tell My Bratha what you need and get a straight answer — fast.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href={WA_GENERAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
                </a>
                <a href={`tel:${PHONE_TEL}`} className="btn btn-outline-gold">
                  <Phone className="h-4 w-4" /> Call {PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
