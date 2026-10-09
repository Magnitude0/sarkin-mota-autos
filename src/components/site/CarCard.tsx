import { Calendar, Fuel, Gauge, Crown } from "lucide-react";
import { Link } from "react-router";
import type { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { formatNaira } from "@/lib/site";
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
