import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Car as CarIcon,
  ChevronDown,
  Crown,
  Gauge,
  LayoutGrid,
  Mountain,
  Play,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "@/convex/_generated/api";
import { Counter } from "@/components/site/Counter";
import { Reveal } from "@/components/site/Reveal";
import { CarCard, type Car } from "@/components/site/CarCard";
import { InquireModal } from "@/components/site/InquireModal";
import { LeadForm } from "@/components/site/LeadForm";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TikTokIcon, WhatsAppIcon } from "@/components/site/icons";
import {
  calcEMI,
  CATEGORIES,
  MACHINE_OPTIONS,
  WA_BUDGET_MATCH,
  WA_GENERAL,
  WA_SOURCE,
} from "@/lib/site";
import { cn } from "@/lib/utils";

/* ───────────────────────── Hero ───────────────────────── */

const HERO_STATS = [
  { value: 450, suffix: "+", label: "Machines Sold" },
  { value: 40, suffix: "%", label: "Min. Deposit" },
  { value: 36, suffix: "", label: "States Delivered" },
  { value: 100, suffix: "%", label: "Carfax Verified" },
];

function Hero() {
  return (
    <section className="hero-bg relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="grid-pattern absolute inset-0" aria-hidden="true" />
      <div className="container-site relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          <span className="section-label">
            👑 Premium Foreign Used Dealership — Abuja, Nigeria
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          className="h-display mt-5 text-[clamp(2rem,5vw,3.8rem)] text-white"
        >
          MY BRATHA 👑
          <br />
          <span className="text-gradient-gold">OWN YOUR</span>
          <br />
          <span className="text-red">DREAM MACHINE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-[#b8b8b8] sm:text-lg"
        >
          Welcome to the capital of pristine machines. Clean American-spec
          SUVs, heavy European beasts, luxury sedans. Start today with our{" "}
          <strong className="font-semibold text-white">
            flexible 40% deposit plan
          </strong>
          . Zero mileage tampering. Zero salvage stories.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.34, ease: [0.4, 0, 0.2, 1] }}
          className="mt-9 flex flex-col gap-4 sm:flex-row"
        >
          <Link to="/inventory" className="btn btn-red">
            Browse Machines <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={WA_GENERAL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Chat My Bratha
          </a>
        </motion.div>

        {/* Stats */}
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-14 grid grid-cols-2 gap-y-8 border-t border-white/10 pt-8 lg:grid-cols-4"
        >
          {HERO_STATS.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                "flex flex-col items-center gap-1 px-4 text-center",
                i > 0 && "lg:border-l lg:border-gold/25",
              )}
            >
              <dt className="order-2 font-display text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#888]">
                {s.label}
              </dt>
              <dd className="order-1 font-display text-3xl font-black text-gold sm:text-4xl">
                <Counter to={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* Scroll indicator */}
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gold/70"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}

/* ───────────────────── Featured machines ───────────────────── */

function FeaturedSection({
  onInquire,
}: {
  onInquire: (car: Car) => void;
}) {
  const featured = useQuery(api.inventory.featured);

  return (
    <section className="py-20 sm:py-24">
      <div className="container-site">
        <Reveal className="text-center">
          <span className="section-label">Handpicked Masterpieces</span>
          <h2 className="h-display mt-4 text-[clamp(1.6rem,3.5vw,2.6rem)] text-white">
            Fresh Machines Just Landed <span className="text-gold">🔥</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[#a8a8a8]">
            Every machine is 150-point inspected and Carfax verified. No
            stories.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured === undefined
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="card-dark flex flex-col overflow-hidden"
                  style={{ transform: "none" }}
                >
                  <div className="skeleton h-[210px]" />
                  <div className="flex flex-col gap-3 p-5">
                    <div className="skeleton h-5 w-3/4 rounded" />
                    <div className="skeleton h-7 w-1/2 rounded" />
                    <div className="skeleton h-9 w-full rounded-full" />
                  </div>
                </div>
              ))
            : featured.length === 0
              ? (
                <div
                  className="col-span-full rounded-[20px] border border-gold/25 bg-[#1c1c1e] p-10 text-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                  style={{ transform: "none" }}
                >
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                    <Crown
                      className="h-8 w-8 text-gold"
                      fill="currentColor"
                      strokeWidth={1.2}
                    />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-black text-white">
                    Premium Machines Loading Soon
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-[#a8a8a8]">
                    Our next shipment is clearing port right now. Chat My
                    Bratha to get notified the moment fresh machines land.
                  </p>
                  <a
                    href={WA_GENERAL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-wa mt-6"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Notify Me First
                  </a>
                </div>
              )
              : (
                featured.map((car, i) => (
                  <Reveal key={car._id} delay={(i % 3) * 0.1}>
                    <CarCard car={car} onInquire={onInquire} />
                  </Reveal>
                ))
              )}
        </div>

        <Reveal className="mt-10 text-center">
          <Link to="/inventory" className="btn btn-outline-gold">
            View Full Catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────── Why Sarkin Mota ───────────────────── */

const WHY = [
  {
    icon: Crown,
    title: '"My Bratha" Guarantee',
    text: "Founded and run personally by Aliyu Mohammad. You deal direct with the king — no middlemen, no call centres.",
  },
  {
    icon: Gauge,
    title: "True Mileage Only",
    text: "No altered odometers. Every machine ships with its real Carfax report. If we can't prove it, we don't sell it.",
  },
  {
    icon: Wrench,
    title: "150-Point Inspection",
    text: "Mechanical wizards run full diagnostics on every machine before it ever touches the showroom floor.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    text: "Enclosed flatbed delivery to all 36 states — with WhatsApp updates from our gate to your gate.",
  },
];

function WhySection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-site">
        <Reveal className="text-center">
          <span className="section-label">The Sarkin Mota Standard</span>
          <h2 className="h-display mt-4 text-[clamp(1.6rem,3.5vw,2.6rem)] text-white">
            Why Nigeria Buys From <span className="text-gold">Us</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div className="card-dark h-full p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/40 bg-gold/10">
                  <item.icon className="h-6 w-6 text-gold" />
                </span>
                <h3 className="mt-4 font-display text-lg font-extrabold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#a8a8a8]">
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── EMI Calculator ───────────────────── */

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="field-label mb-0">{label}</label>
        <span className="font-display text-base font-extrabold text-gold">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--fill": `${pct}%` } as React.CSSProperties}
      />
    </div>
  );
}

function EMICalculator() {
  const [value, setValue] = useState(60000000);
  const [depositPct, setDepositPct] = useState(40);
  const [months, setMonths] = useState(24);
  const result = calcEMI(value, depositPct, months);

  return (
    <section className="py-20 sm:py-24">
      <div className="container-site">
        <Reveal className="text-center">
          <span className="section-label">Crunch the Numbers</span>
          <h2 className="h-display mt-4 text-[clamp(1.6rem,3.5vw,2.6rem)] text-white">
            Build Your Own <span className="text-red">Payment Plan</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[#a8a8a8]">
            Flexible 40% minimum deposit. You decide the rest.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            className="mx-auto mt-12 grid max-w-4xl gap-8 rounded-[20px] border border-white/10 bg-[#151517] p-7 shadow-[0_8px_32px_rgba(0,0,0,0.4)] sm:p-10 lg:grid-cols-2"
            style={{ transform: "none" }}
          >
            {/* Sliders */}
            <div className="flex flex-col justify-center gap-9">
              <Slider
                label="Machine Value"
                value={value}
                min={2000000}
                max={180000000}
                step={1000000}
                format={(v) => "₦" + (v / 1000000).toFixed(1) + "M"}
                onChange={setValue}
              />
              <Slider
                label="Deposit %"
                value={depositPct}
                min={40}
                max={80}
                step={5}
                format={(v) => v + "%"}
                onChange={setDepositPct}
              />
              <Slider
                label="Repayment"
                value={months}
                min={6}
                max={36}
                step={1}
                format={(v) => `${v} months`}
                onChange={setMonths}
              />
            </div>

            {/* Results */}
            <div className="flex flex-col justify-center gap-5 rounded-2xl border border-gold/20 bg-gradient-to-br from-[#1c1c1e] to-[#14140f] p-7">
              <div>
                <p className="field-label mb-1">Required Down Payment</p>
                <p className="font-display text-3xl font-black text-gold">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    maximumFractionDigits: 0,
                  }).format(result.deposit)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="field-label mb-1">Est. Monthly Payment</p>
                  <p className="font-display text-xl font-extrabold text-white">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                      maximumFractionDigits: 0,
                    }).format(result.monthly)}
                  </p>
                </div>
                <div>
                  <p className="field-label mb-1">Balance to Finance</p>
                  <p className="font-display text-xl font-extrabold text-white">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                      maximumFractionDigits: 0,
                    }).format(result.balance)}
                  </p>
                </div>
              </div>
              <a
                href={WA_BUDGET_MATCH}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold btn-block"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Match Machines to My Budget
              </a>
              <p className="text-center text-xs text-[#888]">
                Indicative terms at 15% p.a. Contact showroom for personalised
                terms.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────── Categories ───────────────────── */

const CATEGORY_ICONS: Record<string, typeof CarIcon> = {
  Mountain,
  CarIcon,
  Crown,
  Truck,
  Zap,
  LayoutGrid,
};

function Categories() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-site">
        <Reveal className="text-center">
          <span className="section-label">Pick Your Class</span>
          <h2 className="h-display mt-4 text-[clamp(1.6rem,3.5vw,2.6rem)] text-white">
            Shop By <span className="text-gold">Category</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => {
            const Icon = CATEGORY_ICONS[cat.icon] ?? CarIcon;
            const to =
              cat.type === "All"
                ? "/inventory"
                : `/inventory?type=${encodeURIComponent(cat.type)}`;
            return (
              <Reveal key={cat.name} delay={(i % 3) * 0.1}>
                <Link
                  to={to}
                  className={cn(
                    "group flex h-40 flex-col items-start justify-between rounded-[20px] border border-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40",
                    cat.tile,
                  )}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-black/30 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6 text-gold" />
                  </span>
                  <span className="font-display text-lg font-extrabold uppercase tracking-[0.08em] text-white">
                    {cat.name}
                    <span className="mt-1 block h-0.5 w-0 rounded-full bg-gold transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Testimonials ───────────────────── */

const TESTIMONIALS = [
  {
    name: "Musa Abdullahi",
    location: "Maitama, Abuja",
    machine: "Mercedes G-Wagon",
    quote:
      "Aliyu's word is his bond. My G-Wagon came with the Carfax, the full inspection report and zero funny stories. This man no dey carry last.",
  },
  {
    name: "Ngozi Eze",
    location: "Lekki, Lagos",
    machine: "Lexus RX 350",
    quote:
      "I almost bought a machine with tampered mileage elsewhere. Sarkin Mota showed me the real report and saved me millions. Trusted for life.",
  },
  {
    name: "Ibrahim Sani",
    location: "Kano",
    machine: "Toyota Land Cruiser",
    quote:
      "From deposit to delivery in Kano in six days. My Bratha dey do the needful. The Land Cruiser is an absolute beast.",
  },
];

function Testimonials() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-site">
        <Reveal className="text-center">
          <span className="section-label">Real Owners, Real Machines</span>
          <h2 className="h-display mt-4 text-[clamp(1.6rem,3.5vw,2.6rem)] text-white">
            The Kingdom <span className="text-gold">Speaks</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.12}>
              <figure
                className="card-dark flex h-full flex-col p-7"
                style={{ transform: "none" }}
              >
                <div
                  className="flex gap-1 text-gold"
                  aria-label="5 out of 5 stars"
                >
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className="text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[0.95rem] italic leading-relaxed text-white/90">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-white/10 pt-4">
                  <p className="font-display text-sm font-extrabold text-gold">
                    {t.name}
                  </p>
                  <p className="text-xs text-[#888]">
                    {t.location} · {t.machine}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Social funnel ───────────────────── */

const SOCIAL_POINTS = [
  { icon: Play, text: "Walkaround videos of every fresh arrival" },
  { icon: Bell, text: "First dibs before a machine hits the floor" },
  { icon: Crown, text: "One tap straight to Aliyu's WhatsApp" },
];

function SocialStrip() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-site">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[20px] border border-gold/25 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.5)] sm:p-12"
            style={{
              transform: "none",
              background:
                "radial-gradient(ellipse at 10% 20%, rgba(255,215,0,0.16) 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(200,16,46,0.14) 0%, transparent 50%), linear-gradient(135deg, #131310, #0a0a0a)",
            }}
          >
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_360px]">
              <div>
                <span className="section-label">See It Before Anyone Else</span>
                <h2 className="h-display mt-4 text-[clamp(1.6rem,3.5vw,2.6rem)] text-white">
                  Every Machine Drops on{" "}
                  <span className="text-gold">TikTok First</span> 📱
                </h2>
                <p className="mt-4 max-w-xl text-[#b8b8b8]">
                  Aliyu films every fresh arrival himself — walkarounds, first
                  starts and honest talk. Watch it live, then message My Bratha
                  to secure it before the post takes off.
                </p>
                <div className="mt-7 flex flex-col gap-4 sm:flex-row">
                  <a
                    href="https://www.tiktok.com/@sarkinmota"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-white"
                  >
                    <TikTokIcon className="h-4 w-4" /> Follow @sarkinmota
                  </a>
                  <a
                    href={WA_GENERAL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-wa"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Claim It on WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {SOCIAL_POINTS.map((p) => (
                  <div
                    key={p.text}
                    className="flex items-center gap-3 rounded-2xl border border-gold/20 bg-black/40 p-4"
                    style={{ transform: "none" }}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                      <p.icon className="h-4 w-4 text-gold" />
                    </span>
                    <p className="text-sm font-semibold leading-snug text-[#e8e8e8]">
                      {p.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────── VIP Call Request ───────────────────── */

const VIP_BULLETS = [
  { icon: Crown, text: "Direct line to Aliyu Mohammad — no middlemen" },
  { icon: Zap, text: "Response within minutes, not days" },
  { icon: WhatsAppIcon, text: "Or jump straight to WhatsApp and skip the form" },
];

function VIPSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-site">
        <Reveal>
          <div
            className="grid gap-10 rounded-[20px] border border-gold/20 bg-gradient-to-br from-[#16161a] via-[#141410] to-[#1a1012] p-7 shadow-[0_8px_32px_rgba(0,0,0,0.4)] sm:p-12 lg:grid-cols-2"
            style={{ transform: "none" }}
          >
            <div className="flex flex-col justify-center">
              <span className="section-label">VIP Treatment</span>
              <h2 className="h-display mt-4 text-[clamp(1.6rem,3.5vw,2.6rem)] text-white">
                Request a <span className="text-gold">VIP Call</span> 👑
              </h2>
              <p className="mt-4 text-[#b8b8b8]">
                Fill the form and Aliyu Mohammad will call you personally. No
                middlemen, no call centres — just the king on your line.
              </p>
              <ul className="mt-7 flex flex-col gap-4">
                {VIP_BULLETS.map((b) => (
                  <li key={b.text} className="flex items-center gap-3 text-sm text-[#d8d8d8]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                      <b.icon className="h-4 w-4 text-gold" />
                    </span>
                    {b.text}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <LeadForm
                machineOptions={MACHINE_OPTIONS}
                machineLabel="Machine You Want"
                submitLabel="SEND LEAD TO MY BRATHA 👑"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────── USA Sourcing Banner ───────────────────── */

const SOURCING_GRID = [
  { emoji: "🇺🇸", label: "US Dealer Auctions" },
  { emoji: "🇩🇪", label: "European Showrooms" },
  { emoji: "🇨🇦", label: "Canada Stock" },
  { emoji: "🛳️", label: "Port to Door" },
];

function SourcingBanner() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-site">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[20px] border border-red/30 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.5)] sm:p-12"
            style={{
              transform: "none",
              background:
                "radial-gradient(ellipse at 80% 20%, rgba(200,16,46,0.28) 0%, transparent 50%), linear-gradient(135deg, #150a0c, #0a0a0a)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
              aria-hidden="true"
            />
            <div className="relative">
              <span className="section-label">Custom Sourcing</span>
              <h2 className="h-display mt-4 max-w-2xl text-[clamp(1.6rem,3.5vw,2.6rem)] text-white">
                We&apos;ll Source It Direct From the USA{" "}
                <span className="text-gold">🇺🇸</span>
              </h2>
              <p className="mt-4 max-w-2xl text-[#c8c8c8]">
                We have direct access to US/Canada Dealer Auctions and European
                showrooms. We handle sourcing, shipping, customs clearing and
                door delivery — you just pick the machine.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {SOURCING_GRID.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-white/10 bg-black/40 p-4 text-center backdrop-blur"
                    style={{ transform: "none" }}
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <p className="mt-2 font-display text-xs font-bold uppercase tracking-[0.1em] text-white">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a
                  href={WA_SOURCE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-red"
                >
                  Order From USA <ArrowRight className="h-4 w-4" />
                </a>
                <Link to="/inventory" className="btn btn-outline-gold">
                  Browse Current Stock
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────── Page ───────────────────── */

export default function Landing() {
  const seedIfEmpty = useMutation(api.seed.seedIfEmpty);
  const [inquireCar, setInquireCar] = useState<Car | null>(null);

  useEffect(() => {
    void seedIfEmpty();
  }, [seedIfEmpty]);

  return (
    <SiteLayout>
      <Hero />
      <FeaturedSection onInquire={setInquireCar} />
      <div className="gold-divider container-site" aria-hidden="true" />
      <WhySection />
      <EMICalculator />
      <div className="gold-divider container-site" aria-hidden="true" />
      <Categories />
      <Testimonials />
      <SocialStrip />
      <VIPSection />
      <SourcingBanner />
      <section className="pb-20">
        <div className="container-site flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-display text-lg font-extrabold text-white">
              Ready to drive like a king? <span className="text-gold">My Bratha.</span>
            </p>
            <p className="text-sm text-[#888]">
              Call <a href="tel:+2347015136111" className="text-gold hover:underline">0701 513 6111</a> — direct to the showroom floor.
            </p>
          </div>
          <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
            <WhatsAppIcon className="h-4 w-4" /> Chat My Bratha
          </a>
        </div>
      </section>

      <InquireModal car={inquireCar} open={inquireCar !== null} onClose={() => setInquireCar(null)} />
    </SiteLayout>
  );
}
