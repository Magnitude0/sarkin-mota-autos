import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  HERO_IMAGES,
  HERO_SLIDE_SECONDS,
  HERO_VIDEO,
  HERO_VIDEO_POSTER,
} from "@/lib/hero-media";

/**
 * Full-bleed backdrop for the hero: a slowly crossfading, Ken Burns-zoomed
 * slideshow (or a video when HERO_VIDEO is set), always blurred and dimmed
 * so the hero copy stays king. Configure the media in src/lib/hero-media.ts.
 */
export function HeroBackdrop() {
  const [index, setIndex] = useState(0);
  const [tabHidden, setTabHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Respect prefers-reduced-motion: static first image, no cycling, no zoom.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Stop cycling while the tab is hidden (saves battery/bandwidth).
  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Advance the slideshow.
  useEffect(() => {
    if (HERO_VIDEO || reducedMotion || tabHidden || HERO_IMAGES.length < 2) {
      return;
    }
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % HERO_IMAGES.length),
      HERO_SLIDE_SECONDS * 1000,
    );
    return () => window.clearInterval(id);
  }, [reducedMotion, tabHidden]);

  // Preload every slide so transitions never flash.
  useEffect(() => {
    HERO_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {HERO_VIDEO ? (
        <video
          className="absolute inset-0 h-full w-full scale-[1.08] object-cover opacity-[0.55] blur-[6px]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={HERO_VIDEO_POSTER || HERO_IMAGES[0]}
        >
          <source src={HERO_VIDEO} />
        </video>
      ) : reducedMotion ? (
        HERO_IMAGES[0] ? (
          <img
            key={HERO_IMAGES[0]}
            src={HERO_IMAGES[0]}
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover blur-[6px]"
            style={{ opacity: 0.55 }}
          />
        ) : null
      ) : (
        HERO_IMAGES.map((src, i) => (
          <motion.img
            key={src}
            src={src}
            alt=""
            draggable={false}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={
              i === index
                ? { opacity: 0.55, scale: 1.16 }
                : { opacity: 0, scale: 1.02 }
            }
            transition={{
              opacity: { duration: 1.6, ease: [0.4, 0, 0.2, 1] },
              scale: { duration: HERO_SLIDE_SECONDS, ease: "linear" },
            }}
            className="absolute inset-0 h-full w-full object-cover blur-[6px] will-change-transform"
          />
        ))
      )}

      {/* Readability overlays — keep the copy crisp over the show */}
      <div className="absolute inset-0 bg-[#0a0a0a]/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/25 to-[#0a0a0a]/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
    </div>
  );
}
