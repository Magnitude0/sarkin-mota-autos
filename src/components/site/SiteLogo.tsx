import { Link } from "react-router";
import { cn } from "@/lib/utils";
import logoUrl from "@/assets/logo.svg";

/**
 * The real Sarkin Mota company logo (black tile with the white "M" mark).
 * Used everywhere the brand appears — header, footer, auth and admin.
 */
export function LogoMark({
  size = 44,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={logoUrl}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      draggable={false}
      className={cn("shrink-0 select-none", className)}
      style={{ width: size, height: size }}
    />
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
