import { useId } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

/**
 * The Sarkin Mota "M" mark — two intersecting golden angular blocks with a
 * diagonal negative-space cut, per the company logo.
 */
export function LogoMark({ size = 44 }: { size?: number }) {
  const gradientId = useId();
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 84" style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFE566" />
            <stop offset="1" stopColor="#C9A227" />
          </linearGradient>
        </defs>
        <path d="M8 8 L50 8 L64 68 L8 68 Z" fill={`url(#${gradientId})`} />
        <path d="M70 8 L112 8 L112 68 L56 68 Z" fill={`url(#${gradientId})`} />
      </svg>
    </span>
  );
}

export function SiteLogo({
  to = "/",
  compact = false,
  className,
}: {
  to?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      to={to}
      aria-label="Sarkin Mota Autos — Home"
      className={cn("flex items-center gap-3", className)}
    >
      <LogoMark size={compact ? 38 : 44} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.05rem] font-black tracking-[0.06em] text-white">
          SARKIN <span className="text-gold">MOTA</span>
        </span>
        <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-[#888888]">
          Autos · Abuja
        </span>
      </span>
    </Link>
  );
}
