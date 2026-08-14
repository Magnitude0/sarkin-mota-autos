import { Crown } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-xl"
      style={{
        width: size,
        height: size,
        background:
          "linear-gradient(135deg, rgba(255,215,0,0.22), rgba(200,16,46,0.16))",
        border: "1px solid rgba(255,215,0,0.4)",
        boxShadow: "0 0 24px rgba(255,215,0,0.18)",
      }}
    >
      <Crown
        className="text-gold"
        style={{ width: size * 0.58, height: size * 0.58 }}
        fill="currentColor"
        strokeWidth={1.2}
      />
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
