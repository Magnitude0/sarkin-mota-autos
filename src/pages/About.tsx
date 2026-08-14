import { Crown, HeartHandshake, ShieldCheck, Sparkles, Scale } from "lucide-react";
import { Link } from "react-router";
import { Counter } from "@/components/site/Counter";
import { Reveal } from "@/components/site/Reveal";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { WhatsAppIcon } from "@/components/site/icons";
import { FOUNDER, WA_GENERAL } from "@/lib/site";

const FOUNDER_STATS = [
  { value: 450, suffix: "+", label: "Machines Sold" },
  { value: 100, suffix: "%", label: "Carfax Verified" },
  { value: 36, suffix: "", label: "States Covered" },
  { value: 150, suffix: "", label: "Inspection Points" },
];

const TIMELINE = [
  {
    year: "2018",
    title: "One Man. Zero Inventory. 100% Hustle.",
    text: "Aliyu Mohammad started from nothing — a phone, a TikTok account and an unshakeable belief that Nigerians deserved cleaner, honest machines.",
  },
  {
    year: "2020",
    title: "Sarkin Mota Opens in Abuja CBD",
    text: "The first showroom opens on Olusegun Obasanjo Way. Word of mouth spreads faster than the machines sell.",
  },
  {
    year: "2022",
    title: "The 40% Revolution",
    text: "We introduce the flexible 40% minimum deposit plan — making premium machines reachable for thousands of Nigerians who were locked out of the market.",
  },
  {
    year: "2024",
    title: "Nationwide — Abuja to All 36 States",
    text: "Enclosed flatbed delivery and WhatsApp tracking now reach every corner of Nigeria. The kingdom goes national.",
  },
  {
    year: "2025+",
    title: "Electric. Smarter. Still Premium. 👑",
    text: "EVs, hybrids and smarter sourcing from US, European and Canadian markets. Same honesty, sharper machines.",
  },
];

const VALUES = [
  {
    icon: Scale,
    title: "Absolute Honesty",
    text: "Real Carfax, real mileage, real condition. If a machine has a story, you hear it first.",
  },
  {
    icon: ShieldCheck,
    title: "Uncompromising Standards",
    text: "150 inspection points or it never reaches our floor. No shortcuts, ever.",
  },
  {
    icon: HeartHandshake,
    title: "Brotherhood First",
    text: "Every customer is family. We answer, we deliver, we stand behind every machine.",
  },
  {
    icon: Sparkles,
    title: "Premium Non-Negotiable",
    text: "From the showroom floor to the delivery ramp, the experience is fit for a king.",
  },
];

export default function About() {
  return (
    <SiteLayout>
      <PageHero
        label="Our Story"
        title={
          <>
            From One Man&apos;s Passion to Nigeria&apos;s{" "}
            <span className="text-gold">Most Trusted Name</span>
          </>
        }
        sub="This isn't just a dealership. It's a movement built on trust, authenticity and a deep love for premium machines."
      />

      {/* Founder */}
      <section className="py-16 sm:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-[380px_1fr]">
          <Reveal>
            <div className="card-dark flex flex-col items-center p-8 text-center">
              <span
                className="flex h-28 w-28 items-center justify-center rounded-full text-5xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,215,0,0.35), rgba(200,16,46,0.25))",
                  border: "2px solid rgba(255,215,0,0.5)",
                  boxShadow: "0 0 40px rgba(255,215,0,0.25)",
                }}
                aria-hidden="true"
              >
                👑
              </span>
              <h2 className="mt-6 font-display text-2xl font-black text-white">
                {FOUNDER}
              </h2>
              <p className="mt-1 font-display text-xs font-bold uppercase tracking-[0.2em] text-gold">
                Founder &amp; CEO
              </p>
              <p className="mt-5 text-sm italic leading-relaxed text-[#c8c8c8]">
                “I built this business on one rule: sell a man a machine like
                you&apos;d sell it to your own brother. That&apos;s the “My
                Bratha” promise.”
              </p>
              <div className="mt-6 gold-divider w-full" />
              <p className="mt-4 text-xs text-[#777]">
                Follow the man himself —{" "}
                <span className="text-gold">@sarkinmota</span> on TikTok &amp;
                Instagram
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col justify-center">
              <span className="section-label">The King Behind the Crown</span>
              <h2 className="h-display mt-4 text-[clamp(1.6rem,3.5vw,2.4rem)] text-white">
                Meet <span className="text-gold">{FOUNDER}</span>
              </h2>
              <div className="mt-5 flex flex-col gap-4 text-[#b8b8b8]">
                <p>
                  In 2018, Aliyu Mohammad was one man with a phone and a dream.
                  While others sold machines with hidden accidents and tampered
                  odometers, he built his name the hard way — showing every
                  Carfax report, filming every inspection, and answering every
                  single message himself.
                </p>
                <p>
                  Today, Sarkin Mota Autos is the dealership Nigerians call
                  when they want the truth. From Abuja&apos;s Central Business
                  District, we source clean machines from US dealer auctions,
                  European showrooms and Canadian dealers — then deliver them,
                  Carfax in hand, to all 36 states.
                </p>
                <p>
                  No middlemen. No call centres. No stories. Just Aliyu — and
                  the machines he&apos;d proudly drive himself.
                </p>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-6">
                {FOUNDER_STATS.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-gold/20 bg-[#1c1c1e] p-5 text-center"
                    style={{ transform: "none" }}
                  >
                    <dd className="font-display text-3xl font-black text-gold">
                      <Counter to={s.value} suffix={s.suffix} />
                    </dd>
                    <dt className="mt-1 font-display text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#888]">
                      {s.label}
                    </dt>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link to="/inventory" className="btn btn-red">
                  Browse Machines
                </Link>
                <a
                  href={WA_GENERAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Chat My Bratha
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20">
        <div className="container-site">
          <Reveal className="text-center">
            <span className="section-label">The Journey</span>
            <h2 className="h-display mt-4 text-[clamp(1.6rem,3.5vw,2.6rem)] text-white">
              From Hustle to <span className="text-gold">Kingdom</span>
            </h2>
          </Reveal>

          <div className="relative mx-auto mt-14 max-w-3xl">
            <div
              className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-gold/60 via-gold/25 to-transparent lg:left-1/2"
              aria-hidden="true"
            />
            <ol className="flex flex-col gap-10">
              {TIMELINE.map((item, i) => {
                const left = i % 2 === 0;
                return (
                  <li key={item.year} className="relative pl-12 lg:w-1/2 lg:pl-0">
                    <span
                      className={`absolute left-2.5 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-gold bg-[#0a0a0a] lg:left-auto ${
                        left
                          ? "lg:-right-2.5"
                          : "lg:left-1/2 lg:-translate-x-1/2"
                      }`}
                      aria-hidden="true"
                    />
                    <Reveal
                      className={
                        left
                          ? "lg:pr-10 lg:text-right"
                          : "lg:ml-auto lg:pl-10"
                      }
                    >
                      <div className="card-dark p-6">
                        <span className="font-display text-sm font-black tracking-[0.2em] text-gold">
                          {item.year}
                        </span>
                        <h3 className="mt-2 font-display text-lg font-extrabold leading-snug text-white">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#a8a8a8]">
                          {item.text}
                        </p>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="py-16 sm:py-20">
        <div className="container-site">
          <Reveal className="text-center">
            <span className="section-label">What We Stand For</span>
            <h2 className="h-display mt-4 text-[clamp(1.6rem,3.5vw,2.6rem)] text-white">
              Core <span className="text-gold">Values</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="card-dark h-full p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/40 bg-gold/10">
                    <v.icon className="h-6 w-6 text-gold" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-extrabold text-white">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#a8a8a8]">
                    {v.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-20">
        <div className="container-site">
          <Reveal>
            <div
              className="rounded-[20px] border border-red/30 p-10 text-center shadow-[0_8px_40px_rgba(0,0,0,0.5)] sm:p-14"
              style={{
                transform: "none",
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(200,16,46,0.3) 0%, transparent 60%), linear-gradient(180deg, #141010, #0a0a0a)",
              }}
            >
              <Crown
                className="mx-auto h-10 w-10 text-gold"
                fill="currentColor"
                strokeWidth={1.2}
              />
              <h2 className="h-display mt-4 text-[clamp(1.8rem,4vw,3rem)] text-white">
                Ready to Drive Like a <span className="text-gold">King?</span> 👑
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-[#b8b8b8]">
                Your dream machine is one message away. My Bratha is waiting.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link to="/inventory" className="btn btn-gold">
                  Browse Machines
                </Link>
                <a
                  href={WA_GENERAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-white"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Chat My Bratha
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
