import { Calendar, Fuel, Gauge, Heart, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import {
  formatNaira,
  getSavedIds,
  MIN_DEPOSIT_PCT,
  toggleSavedId,
} from "@/lib/site";
import { CarImage } from "./CarImage";

export type Car = Doc<"inventory">;

const STATUS_LABEL: Record<string, string> = {
  available: "Available",
  sold: "Sold",
  reserved: "Reserved",
};

export function statusChip(status: string) {
  return (
    <span
      className={cn(
        "badge-chip",
        status === "available" && "badge-available",
        status === "sold" && "badge-sold",
        status === "reserved" && "badge-reserved",
      )}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function CarCard({
  car,
  onInquire,
  className,
}: {
  car: Car;
  onInquire?: (car: Car) => void;
  className?: string;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(getSavedIds().includes(car._id));
  }, [car._id]);

  const handleHeart = () => {
    setSaved(toggleSavedId(car._id).includes(car._id));
  };

  const deposit = Math.round(car.price * (MIN_DEPOSIT_PCT / 100));

  return (
    <article
      className={cn(
        "card-dark group flex flex-col overflow-hidden",
        className,
      )}
    >
      <Link
        to={`/car/${car._id}`}
        aria-label={`View details for ${car.title}`}
        className="relative block overflow-hidden"
      >
        <CarImage
          src={car.images?.[0]}
          alt={car.title}
          fallbackLabel={car.title}
          className="h-[210px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {car.badge === "new" && <span className="badge-chip badge-new">New</span>}
          {car.badge === "hot" && <span className="badge-chip badge-hot">Hot</span>}
          {car.status === "sold" && <span className="badge-chip badge-sold">Sold</span>}
          {car.status === "reserved" && (
            <span className="badge-chip badge-reserved">Reserved</span>
          )}
        </div>

        {/* Save heart */}
        <button
          type="button"
          aria-label={saved ? "Remove from saved machines" : "Save machine"}
          onClick={(e) => {
            e.preventDefault();
            handleHeart();
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/50 backdrop-blur transition-all hover:scale-110"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              saved ? "fill-red text-red" : "text-white",
            )}
          />
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[1.02rem] font-extrabold leading-snug text-white">
          <Link
            to={`/car/${car._id}`}
            className="line-clamp-1 transition-colors hover:text-gold"
          >
            {car.title}
          </Link>
        </h3>

        <div className="mt-2 flex items-end justify-between gap-2">
          <p className="font-display text-xl font-black tracking-tight text-gold">
            {formatNaira(car.price)}
          </p>
          <p className="text-right text-xs font-semibold text-red">
            or {formatNaira(deposit)} deposit
          </p>
        </div>

        {/* Specs row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/10 pt-3 text-xs text-[#b8b8b8]">
          {car.year ? (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gold" />
              {car.year}
            </span>
          ) : null}
          {car.mileage ? (
            <span className="inline-flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-gold" />
              {car.mileage}
            </span>
          ) : null}
          {car.fuel ? (
            <span className="inline-flex items-center gap-1.5">
              <Fuel className="h-3.5 w-3.5 text-gold" />
              {car.fuel}
            </span>
          ) : null}
        </div>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <Link
            to={`/car/${car._id}`}
            className="btn btn-outline-gold btn-sm"
            aria-label={`View details for ${car.title}`}
          >
            Details
          </Link>
          <button
            type="button"
            onClick={() => onInquire?.(car)}
            className="btn btn-red btn-sm"
            aria-label={`Inquire about ${car.title}`}
          >
            Inquire <Crown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
