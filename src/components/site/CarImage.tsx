import { Car } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders a machine photo. If the image fails (or is missing), falls back to
 * a branded gradient placeholder so the showroom never looks broken.
 */
export function CarImage({
  src,
  alt,
  className,
  fallbackLabel,
}: {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#1a1a2e] via-[#101014] to-[#2d2400]",
          className,
        )}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
          <Car className="h-6 w-6 text-gold" />
        </span>
        <span className="px-4 text-center text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#888888]">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
