import { useQuery } from "convex/react";
import { Crown, Phone, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { CarCard, statusChip, type Car } from "@/components/site/CarCard";
import { CarImage } from "@/components/site/CarImage";
import { InquireModal } from "@/components/site/InquireModal";
import { Reveal } from "@/components/site/Reveal";
import { SiteLayout } from "@/components/site/SiteLayout";
import { WhatsAppIcon } from "@/components/site/icons";
import { calcEMI, formatNaira, MIN_DEPOSIT_PCT, PHONE_DISPLAY, PHONE_TEL, waLink } from "@/lib/site";

function specsOf(car: Car) {
  return [
    { label: "Year", value: car.year ? String(car.year) : "—" },
    { label: "Make", value: car.make || "—" },
    { label: "Model", value: car.model || "—" },
    { label: "Mileage", value: car.mileage || "—" },
    { label: "Fuel", value: car.fuel || "—" },
    { label: "Engine", value: car.engine || "—" },
    { label: "Transmission", value: car.transmission || "—" },
    { label: "Color", value: car.color || "—" },
    { label: "Body Type", value: car.bodyType || "—" },
  ];
}

export default function CarDetail() {
  const { id } = useParams<{ id: string }>();
  const car = useQuery(
    api.inventory.get,
    id ? { id: id as Id<"inventory"> } : "skip",
  );
  const allCars = useQuery(api.inventory.list);
  const [activeImage, setActiveImage] = useState(0);
  const [inquireOpen, setInquireOpen] = useState(false);

  // Skeleton while loading
  if (car === undefined) {
    return (
      <SiteLayout>
        <div className="container-site pb-16 pt-32">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="skeleton h-[420px] rounded-[20px]" />
              <div className="mt-4 flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton h-[60px] w-20 rounded-xl" />
                ))}
              </div>
              <div className="skeleton mt-10 h-8 w-1/3 rounded" />
              <div className="skeleton mt-4 h-40 w-full rounded" />
            </div>
            <div className="skeleton h-[520px] rounded-[20px] lg:sticky lg:top-24" />
          </div>
        </div>
      </SiteLayout>
    );
  }

  // Invalid or deleted id → back to inventory
  if (car === null) {
    return <Navigate to="/inventory" replace />;
  }

  const images = car.images.length > 0 ? car.images : [""];
  const activeSrc = images[activeImage] ?? images[0];

  const waMachine = waLink(
    `👑 SARKIN MOTA — MACHINE INQUIRY\n\nI'm interested in: ${car.title}\nPrice: ${formatNaira(car.price)}\n\nPlease tell me more, My Bratha! — sarkinmota.com`,
  );

  const similar = (allCars ?? [])
    .filter(
      (c) =>
        c._id !== car._id &&
        (c.bodyType === car.bodyType || (car.make ? c.make === car.make : false)),
    )
    .slice(0, 3);

  return (
    <SiteLayout>
      <section className="container-site pb-16 pt-28">
        <Link
          to="/inventory"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#a8a8a8] transition-colors hover:text-gold"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Inventory
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Left column */}
          <div>
            <div className="overflow-hidden rounded-[20px] border border-white/10">
              <CarImage
                src={activeSrc}
                alt={car.title}
                className="h-[300px] w-full object-cover sm:h-[420px]"
              />
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3" role="tablist" aria-label="Machine photos">
                {images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === activeImage}
                    aria-label={`View photo ${i + 1}`}
                    onClick={() => setActiveImage(i)}
                    className={`h-[60px] w-20 overflow-hidden rounded-xl border-2 transition-all ${
                      i === activeImage
                        ? "border-gold"
                        : "border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <CarImage
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* About */}
            <div className="mt-10">
              <h2 className="font-display text-2xl font-black text-white">
                About This <span className="text-gold">Machine</span>
              </h2>
              <p className="mt-4 leading-relaxed text-[#b8b8b8]">
                {car.description || "Full inspection and Carfax report available on request — no stories, just the facts."}
              </p>
            </div>

            {/* Payment calculator */}
            <div className="mt-10 rounded-[20px] border border-gold/20 bg-[#151517] p-7">
              <h2 className="font-display text-lg font-extrabold text-white">
                Finance This Machine
              </h2>
              <PerCarCalculator price={car.price} />
            </div>
          </div>

          {/* Right sticky panel */}
          <aside className="h-fit rounded-[20px] border border-white/10 bg-[#151517] p-7 lg:sticky lg:top-24">
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-display text-2xl font-black leading-tight text-white">
                {car.title}
              </h1>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="font-display text-3xl font-black text-gold">
                {formatNaira(car.price)}
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-red">
              or {formatNaira(Math.round(car.price * (MIN_DEPOSIT_PCT / 100)))} deposit to start
            </p>

            <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <tbody>
                  {specsOf(car).map((s, i) => (
                    <tr key={s.label} className={i % 2 ? "bg-black/20" : ""}>
                      <th
                        scope="row"
                        className="px-4 py-2.5 text-left font-display text-xs font-bold uppercase tracking-[0.1em] text-[#888]"
                      >
                        {s.label}
                      </th>
                      <td className="px-4 py-2.5 text-right font-medium text-[#e8e8e8]">
                        {s.value}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th
                      scope="row"
                      className="px-4 py-2.5 text-left font-display text-xs font-bold uppercase tracking-[0.1em] text-[#888]"
                    >
                      Status
                    </th>
                    <td className="px-4 py-2.5 text-right">
                      {statusChip(car.status)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setInquireOpen(true)}
                className="btn btn-red btn-block"
              >
                <Crown className="h-4 w-4" /> Inquire Now
              </button>
              <a
                href={waMachine}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa btn-block"
              >
                <WhatsAppIcon className="h-4 w-4" /> Chat My Bratha
              </a>
              <a href={`tel:${PHONE_TEL}`} className="btn btn-outline-gold btn-block">
                <Phone className="h-4 w-4" /> Call {PHONE_DISPLAY}
              </a>
            </div>

            <p className="mt-5 text-center text-xs text-[#777]">
              Carfax report &amp; 150-point inspection included on every
              machine.
            </p>
          </aside>
        </div>

        {/* Similar machines */}
        {similar.length > 0 && (
          <section className="mt-16">
            <Reveal>
              <h2 className="font-display text-2xl font-black text-white">
                Similar <span className="text-gold">Machines</span>
              </h2>
            </Reveal>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((c) => (
                <CarCard key={c._id} car={c} />
              ))}
            </div>
          </section>
        )}
      </section>

      <InquireModal
        car={car}
        open={inquireOpen}
        onClose={() => setInquireOpen(false)}
      />
    </SiteLayout>
  );
}

function PerCarCalculator({ price }: { price: number }) {
  const [depositPct, setDepositPct] = useState(40);
  const [months, setMonths] = useState(24);
  const result = calcEMI(price, depositPct, months);

  const pct = ((depositPct - 40) / (80 - 40)) * 100;
  const mPct = ((months - 6) / (36 - 6)) * 100;

  return (
    <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="flex flex-1 flex-col gap-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="field-label mb-0">Deposit %</span>
            <span className="font-display text-sm font-extrabold text-gold">
              {depositPct}%
            </span>
          </div>
          <input
            type="range"
            className="slider"
            min={40}
            max={80}
            step={5}
            value={depositPct}
            aria-label="Deposit percentage"
            onChange={(e) => setDepositPct(Number(e.target.value))}
            style={{ "--fill": `${pct}%` } as React.CSSProperties}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="field-label mb-0">Repayment</span>
            <span className="font-display text-sm font-extrabold text-gold">
              {months} months
            </span>
          </div>
          <input
            type="range"
            className="slider"
            min={6}
            max={36}
            step={1}
            value={months}
            aria-label="Repayment months"
            onChange={(e) => setMonths(Number(e.target.value))}
            style={{ "--fill": `${mPct}%` } as React.CSSProperties}
          />
        </div>
      </div>

      <div className="w-full rounded-2xl border border-gold/20 bg-[#1c1c1e] p-5 sm:w-64">
        <p className="field-label mb-1">Est. Monthly Payment</p>
        <p className="font-display text-2xl font-black text-gold">
          {formatNaira(result.monthly)}
        </p>
        <p className="mt-2 text-xs text-[#888]">
          {formatNaira(result.deposit)} down · {formatNaira(result.balance)}{" "}
          financed
        </p>
        <p className="mt-2 text-[0.68rem] text-[#666]">
          Indicative 15% p.a. Personalised terms on request.
        </p>
      </div>
    </div>
  );
}
