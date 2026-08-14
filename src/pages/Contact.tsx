import { Clock, Instagram, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { LeadForm } from "@/components/site/LeadForm";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { TikTokIcon, WhatsAppIcon } from "@/components/site/icons";
import {
  ADDRESS,
  PHONE_DISPLAY,
  PHONE_TEL,
  TIKTOK_HANDLE,
  WA_GENERAL,
} from "@/lib/site";

const INFO_CARDS = [
  {
    icon: WhatsAppIcon,
    title: "WhatsApp (Fastest)",
    value: PHONE_DISPLAY,
    href: WA_GENERAL,
    note: "Replies within minutes — 7 days a week",
    external: true,
  },
  {
    icon: Phone,
    title: "Call Directly",
    value: PHONE_DISPLAY,
    href: `tel:${PHONE_TEL}`,
    note: "Mon–Sat, 8AM – 6PM",
    external: false,
  },
  {
    icon: MapPin,
    title: "Showroom",
    value: ADDRESS,
    href: "https://www.google.com/maps/search/?api=1&query=Olusegun+Obasanjo+Way,+Central+Business+District,+Abuja",
    note: "Beside NNPC Mega Station, CBD, Abuja",
    external: true,
  },
  {
    icon: Clock,
    title: "Hours",
    value: "Mon–Sat: 8AM – 6PM",
    note: "WhatsApp available 7 days",
    href: undefined,
    external: false,
  },
];

export default function Contact() {
  return (
    <SiteLayout>
      <PageHero
        label="Get In Touch"
        title={
          <>
            Talk to <span className="text-gold">My Bratha</span> 👑
          </>
        }
        sub="No middlemen, no call centres, no waiting on hold. You get the man who runs the showroom."
      />

      <section className="py-14 sm:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          {/* Info cards */}
          <div className="flex flex-col gap-5">
            {INFO_CARDS.map((c, i) => {
              const inner = (
                <>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/40 bg-gold/10">
                    <c.icon className="h-5 w-5 text-gold" />
                  </span>
                  <div>
                    <h3 className="font-display text-xs font-extrabold uppercase tracking-[0.15em] text-gold">
                      {c.title}
                    </h3>
                    <p className="mt-1.5 text-sm font-semibold leading-relaxed text-white">
                      {c.value}
                    </p>
                    {c.note && <p className="mt-0.5 text-xs text-[#888]">{c.note}</p>}
                  </div>
                </>
              );
              const cls =
                "card-dark flex items-start gap-4 p-6";
              return (
                <Reveal key={c.title} delay={i * 0.08}>
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.external ? "_blank" : undefined}
                      rel={c.external ? "noopener noreferrer" : undefined}
                      className={cls}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className={cls} style={{ transform: "none" }}>
                      {inner}
                    </div>
                  )}
                </Reveal>
              );
            })}

            {/* Socials */}
            <Reveal delay={0.3}>
              <div className="card-dark flex flex-col gap-4 p-6">
                <h3 className="font-display text-xs font-extrabold uppercase tracking-[0.15em] text-gold">
                  Follow the Movement
                </h3>
                <div className="flex gap-3">
                  <a
                    href="https://www.tiktok.com/@sarkinmota"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2.5 rounded-xl border border-white/15 py-3 text-sm font-semibold text-[#e8e8e8] transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:text-gold"
                  >
                    <TikTokIcon className="h-4 w-4" /> TikTok
                  </a>
                  <a
                    href="https://www.instagram.com/sarkinmota"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2.5 rounded-xl border border-white/15 py-3 text-sm font-semibold text-[#e8e8e8] transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:text-gold"
                  >
                    <Instagram className="h-4 w-4" /> Instagram
                  </a>
                  <a
                    href={WA_GENERAL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Sarkin Mota Autos on WhatsApp"
                    className="flex flex-1 items-center justify-center rounded-xl border border-[#25d366]/40 bg-[#25d366]/10 py-3 text-[#4ade80] transition-all hover:-translate-y-0.5 hover:bg-[#25d366]/20"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                  </a>
                </div>
                <p className="text-xs text-[#777]">
                  Daily machine drops, behind-the-scenes and live deals on{" "}
                  <span className="text-gold">{TIKTOK_HANDLE}</span>
                </p>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={0.1}>
            <div
              className="rounded-[20px] border border-gold/20 bg-[#151517] p-7 sm:p-9"
              style={{ transform: "none" }}
            >
              <h2 className="font-display text-xl font-black text-white">
                Send an <span className="text-gold">Inquiry</span>
              </h2>
              <p className="mt-1.5 text-sm text-[#888]">
                Fill this in and it lands straight in the showroom — plus a
                WhatsApp message to My Bratha.
              </p>
              <div className="mt-7">
                <LeadForm
                  machineText
                  machineLabel="Machine Interest"
                  submitLabel="Send via WhatsApp 👑"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Map */}
      <section className="pb-20">
        <div className="container-site">
          <Reveal>
            <div className="overflow-hidden rounded-[20px] border-2 border-gold/30">
              <iframe
                title="Sarkin Mota Autos showroom — Olusegun Obasanjo Way, Abuja"
                src="https://www.google.com/maps?q=Olusegun%20Obasanjo%20Way%2C%20Central%20Business%20District%2C%20Abuja%2C%20Nigeria&output=embed"
                loading="lazy"
                allowFullScreen
                className="h-[400px] w-full border-0"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
