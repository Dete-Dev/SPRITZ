/**
 * SPRITZ video hero — one full viewport, full-bleed video, auto-playing on
 * loop and muted (required by every modern browser for autoplay).
 *
 * Drop your video at `/public/video/hero.mp4`. Optionally provide an
 * additional `/public/video/hero.webm` (VP9) for ~40% smaller file size on
 * Chrome / Firefox; Safari falls back to the MP4 source.
 *
 * If you also drop a `/public/video/hero-poster.webp` still frame, it shows
 * before the video loads — keeps the page from being a black hole during
 * the first 100-300 ms of network fetch.
 */
export default function VideoHero() {
  return (
    <section
      aria-label="SPRITZ — video"
      className="relative w-full h-screen overflow-hidden"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/video/hero-poster.webp"
        className="absolute inset-0 h-full w-full object-cover"
      >
        {/* WebM (VP9) first — smaller — then MP4 fallback for Safari. */}
        <source src="/video/hero.webm" type="video/webm" />
        <source src="/video/hero.mp4" type="video/mp4" />
        {/* Final fallback if the browser supports no <video> source format. */}
      </video>
    </section>
  );
}
