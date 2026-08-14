/**
 * Hero backdrop media for the landing page.
 *
 * 👉 To use YOUR material:
 *  1. Drop photos/videos into `public/assets/` (or use any image URL).
 *  2. Replace the placeholder URLs in `HERO_IMAGES` with your own.
 *  3. Want a background VIDEO instead of the slideshow? Set `HERO_VIDEO`
 *     to the video URL (mp4/webm) — the slideshow then acts as the
 *     poster/fallback while it loads. Keep `HERO_VIDEO` as "" to use
 *     the image slideshow.
 *
 * All media is rendered blurred and dimmed behind the hero copy, so
 * anything that looks good in a dark room works here.
 */

/** Crossfading background images (shown in order, looping). */
export const HERO_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=80",
];

/** Optional full-bleed background video (mp4/webm URL). "" = use the slideshow. */
export const HERO_VIDEO = "";

/** Poster shown while the video loads; defaults to the first image above. */
export const HERO_VIDEO_POSTER = "";

/** Seconds each slideshow image stays on screen. */
export const HERO_SLIDE_SECONDS = 7;
