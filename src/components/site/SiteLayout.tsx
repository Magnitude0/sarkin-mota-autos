import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingButtons } from "./FloatingButtons";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}

export function PageHero({
  label,
  title,
  sub,
  children,
}: {
  label: string;
  title: ReactNode;
  sub?: string;
  children?: ReactNode;
}) {
  return (
    <section className="hero-bg relative overflow-hidden pb-14 pt-32">
      <div className="grid-pattern absolute inset-0" aria-hidden="true" />
      <div className="container-site relative">
        <span className="section-label">{label}</span>
        <h1 className="h-display mt-4 max-w-3xl text-[clamp(2rem,5vw,3.4rem)] text-white">
          {title}
        </h1>
        {sub && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#a8a8a8]">
            {sub}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
