import { useTranslations } from "next-intl";
import Cta from "@/components/ui/Cta";

/**
 * SPRITZ landing hero — brief §1.
 *
 * Full-bleed film, wordmark centred over it (rendered by <JumpingWordmark/>),
 * and the one ask the brief wants: a centred SHOP ALL at the bottom of the
 * frame, in red — the only CTA colour in the system.
 *
 * The floating search pill and the sticky 20% badge are mounted in the locale
 * layout, so they ride every page rather than living here.
 *
 * Video assets: /public/video/hero.{webm,mp4} with hero-poster.webp behind.
 *
 * The frame is 64:27 (2.370), which is what "21:9" actually means in hardware:
 * 2560×1080. Source the film at exactly that and the crop is zero. A literal
 * 21/9 box (2.333) is very slightly narrower and shaves ~1.6% off each side,
 * so the two must agree. At 1920×1080 (16:9) the browser crops the top and
 * bottom away to fill, which is what it did before and why the shot never sat
 * where it was framed. `max-h` keeps an ultrawide
 * window from pushing the hero past the fold, and `min-h` stops a phone from
 * rendering a 160px letterbox; in both of those the crop returns, by design.
 *
 * `preload="metadata"` on purpose: the film is ~3.8MB and this is the first
 * thing on the page, so `auto` spent a phone's whole connection on it before
 * anything below the fold could load. The poster carries the frame until the
 * video is ready — which is what the poster is for.
 */
export default function VideoHero() {
  const t = useTranslations("landing");

  return (
    <section
      data-header-bg="dark"
      aria-label={t("heroLabel")}
      className="relative aspect-[64/27] max-h-[86vh] min-h-[26rem] w-full overflow-hidden bg-ink"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/video/hero-poster.webp"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/video/hero.webm" type="video/webm" />
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* Just enough scrim under the CTA for the cream line to hold. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/70 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-12 flex flex-col items-center gap-4 px-gutter text-center md:bottom-16">
        <p className="font-sans text-sm text-cream md:text-base">
          {t("heroNudge")}
        </p>
        <Cta href="/shop" variant="primary">
          {t("ctaShopAll")}
        </Cta>
      </div>
    </section>
  );
}
