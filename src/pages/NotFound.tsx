import { Crown } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="hero-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="grid-pattern absolute inset-0" aria-hidden="true" />
      <div className="relative">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
          <Crown className="h-10 w-10 text-gold" fill="currentColor" strokeWidth={1.2} />
        </span>
        <h1 className="h-display mt-6 text-7xl text-white">
          4<span className="text-gold">0</span>4
        </h1>
        <p className="mt-3 font-display text-lg font-bold uppercase tracking-[0.15em] text-[#b8b8b8]">
          My Bratha, This Road No Dey
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-[#888]">
          The page you&apos;re looking for was either sold, scrapped, or never
          existed. Let&apos;s get you back on the main road.
        </p>
        <Link to="/" className="btn btn-red mt-8">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
