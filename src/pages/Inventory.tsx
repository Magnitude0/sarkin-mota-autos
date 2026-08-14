import { useQuery } from "convex/react";
import {
  BadgeCheck,
  Car as CarIcon,
  RotateCcw,
  Search,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { api } from "@/convex/_generated/api";
import { CarCard, type Car } from "@/components/site/CarCard";
import { InquireModal } from "@/components/site/InquireModal";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { WhatsAppIcon } from "@/components/site/icons";
import { WA_SOURCE } from "@/lib/site";

const TRUST_BADGES = [
  { icon: BadgeCheck, label: "Certified True Mileage" },
  { icon: ShieldCheck, label: "150-Point Inspection" },
  { icon: BadgeCheck, label: "Carfax Verified" },
  { icon: Truck, label: "Nationwide Delivery" },
  { icon: Wallet, label: "40% Deposit Plans" },
];

type SortKey = "newest" | "price-asc" | "price-desc";

export default function Inventory() {
  const cars = useQuery(api.inventory.list);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [make, setMake] = useState("All");
  const [bodyType, setBodyType] = useState(searchParams.get("type") ?? "All");
  const [year, setYear] = useState("All");
  const [fuel, setFuel] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [inquireCar, setInquireCar] = useState<Car | null>(null);

  const all = cars ?? [];

  const makes = useMemo(
    () =>
      Array.from(new Set(all.map((c) => c.make).filter(Boolean) as string[])).sort(),
    [all],
  );
  const years = useMemo(
    () =>
      Array.from(new Set(all.map((c) => c.year).filter(Boolean) as number[])).sort(
        (a, b) => b - a,
      ),
    [all],
  );
  const fuels = useMemo(
    () =>
      Array.from(new Set(all.map((c) => c.fuel).filter(Boolean) as string[])).sort(),
    [all],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = all.filter((c) => {
      if (q) {
        const haystack = [c.title, c.make, c.model, c.bodyType, c.fuel]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (make !== "All" && c.make !== make) return false;
      if (bodyType !== "All" && c.bodyType !== bodyType) return false;
      if (year !== "All" && c.year !== Number(year)) return false;
      if (fuel !== "All" && c.fuel !== fuel) return false;
      if (minPrice && c.price < Number(minPrice)) return false;
      if (maxPrice && c.price > Number(maxPrice)) return false;
      return true;
    });
    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [all, search, make, bodyType, year, fuel, minPrice, maxPrice, sort]);

  const resetFilters = () => {
    setSearch("");
    setMake("All");
    setBodyType("All");
    setYear("All");
    setFuel("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setSearchParams({});
  };

  const updateTypeParam = (value: string) => {
    setBodyType(value);
    if (value === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ type: value });
    }
  };

  const filterActive =
    search ||
    make !== "All" ||
    bodyType !== "All" ||
    year !== "All" ||
    fuel !== "All" ||
    minPrice ||
    maxPrice;

  return (
    <SiteLayout>
      <PageHero
        label="Carfax Verified • 150-Point Inspected"
        title={
          <>
            Browse Our Premium{" "}
            <span className="text-gold">Machine Catalog</span> 🚗
          </>
        }
        sub="Every machine on this floor has been hand-picked, inspected and verified. No salvage stories, no tampered odometers — just clean, premium machines."
      />

      {/* Trust strip */}
      <section className="border-y border-white/8 bg-[#111]">
        <div className="container-site grid grid-cols-2 gap-4 py-6 sm:grid-cols-3 lg:grid-cols-5">
          {TRUST_BADGES.map((b) => (
            <div
              key={b.label}
              className="flex items-center justify-center gap-2.5 text-center"
            >
              <b.icon className="h-5 w-5 shrink-0 text-gold" />
              <span className="font-display text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#d8d8d8]">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-site">
          {/* Search */}
          <div className="relative mb-10">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by make, model or body type… e.g. Lexus RX"
              aria-label="Search machines"
              className="input-dark w-full rounded-full py-4 pl-12 pr-5 text-base"
              style={{ borderColor: "rgba(255,215,0,0.45)" }}
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Sidebar filters */}
            <aside
              aria-label="Filter machines"
              className="h-fit rounded-[20px] border border-white/10 bg-[#151517] p-6 lg:sticky lg:top-24"
              style={{ transform: "none" }}
            >
              <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-gold">
                Filter Machines
              </h2>

              <div className="mt-5 flex flex-col gap-4">
                <div>
                  <label htmlFor="f-make" className="field-label">
                    Make / Brand
                  </label>
                  <select
                    id="f-make"
                    className="select-dark"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                  >
                    <option value="All">All Makes</option>
                    {makes.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="f-body" className="field-label">
                    Body Type
                  </label>
                  <select
                    id="f-body"
                    className="select-dark"
                    value={bodyType}
                    onChange={(e) => updateTypeParam(e.target.value)}
                  >
                    {["All", "SUV", "Sedan", "Luxury", "Truck", "Electric"].map(
                      (b) => (
                        <option key={b} value={b}>
                          {b === "All" ? "All Types" : b}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="f-year" className="field-label">
                    Year
                  </label>
                  <select
                    id="f-year"
                    className="select-dark"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    <option value="All">Any Year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="f-fuel" className="field-label">
                    Fuel Type
                  </label>
                  <select
                    id="f-fuel"
                    className="select-dark"
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value)}
                  >
                    <option value="All">Any Fuel</option>
                    {fuels.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="f-min" className="field-label">
                      Min Price (₦)
                    </label>
                    <input
                      id="f-min"
                      type="number"
                      min={0}
                      step={500000}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="2,000,000"
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label htmlFor="f-max" className="field-label">
                      Max Price (₦)
                    </label>
                    <input
                      id="f-max"
                      type="number"
                      min={0}
                      step={500000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="180,000,000"
                      className="input-dark"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="btn btn-red btn-block"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Filters
                </button>

                <div className="mt-2 rounded-2xl border border-red/25 bg-red/10 p-4">
                  <p className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#ff8b97]">
                    Can't find it?
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#b8b8b8]">
                    We&apos;ll source any machine direct from US/Europe auctions
                    and deliver port-to-door.
                  </p>
                  <a
                    href={WA_SOURCE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-gold btn-sm mt-3 w-full"
                  >
                    Custom Source It
                  </a>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#a8a8a8]">
                  Showing{" "}
                  <span className="font-display font-extrabold text-gold">
                    {cars === undefined ? "…" : filtered.length}
                  </span>{" "}
                  machine{cars !== undefined && filtered.length !== 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-3">
                  <label htmlFor="sort" className="field-label mb-0">
                    Sort
                  </label>
                  <select
                    id="sort"
                    className="select-dark w-auto py-2 text-sm"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                  </select>
                </div>
              </div>

              {cars === undefined ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="card-dark overflow-hidden"
                      style={{ transform: "none" }}
                    >
                      <div className="skeleton h-[210px]" />
                      <div className="flex flex-col gap-3 p-5">
                        <div className="skeleton h-5 w-3/4 rounded" />
                        <div className="skeleton h-7 w-1/2 rounded" />
                        <div className="skeleton h-9 w-full rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div
                  className="rounded-[20px] border border-white/10 bg-[#151517] p-12 text-center"
                  style={{ transform: "none" }}
                >
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                    <CarIcon className="h-7 w-7 text-gold" />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-black text-white">
                    No machines match those filters
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-[#888]">
                    Try widening your search — or chat My Bratha and we&apos;ll
                    find exactly what you want.
                  </p>
                  <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="btn btn-outline-gold btn-sm"
                    >
                      Clear Filters
                    </button>
                    <a
                      href={WA_SOURCE}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-wa btn-sm"
                    >
                      <WhatsAppIcon className="h-4 w-4" /> Ask My Bratha
                    </a>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((car) => (
                    <CarCard key={car._id} car={car} onInquire={setInquireCar} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Custom sourcing banner */}
      <section className="pb-16">
        <div className="container-site">
          <div
            className="relative overflow-hidden rounded-[20px] border border-red/30 p-8 text-center sm:p-10"
            style={{
              transform: "none",
              background:
                "radial-gradient(ellipse at 20% 30%, rgba(200,16,46,0.25) 0%, transparent 55%), linear-gradient(135deg, #140a0c, #0a0a0a)",
            }}
          >
            <h2 className="h-display text-[clamp(1.4rem,3vw,2.2rem)] text-white">
              We&apos;ll Import It Direct From the USA{" "}
              <span className="text-gold">🇺🇸</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[#b8b8b8]">
              US Dealer Auctions, European showrooms, Canadian stock. Sourcing,
              shipping, customs and door delivery — handled.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href={WA_SOURCE}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-red"
              >
                Request Custom Import
              </a>
              <a
                href={WA_SOURCE}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-gold"
              >
                Learn About Sourcing
              </a>
            </div>
          </div>
        </div>
      </section>

      <InquireModal
        car={inquireCar}
        open={inquireCar !== null}
        onClose={() => setInquireCar(null)}
      />
    </SiteLayout>
  );
}
