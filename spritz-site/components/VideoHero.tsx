import { useTranslations } from "next-intl";
import Cta from "@/components/ui/Cta";
import HeroParallax from "@/components/motion/HeroParallax";

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
 * The film sits in <HeroParallax/> so it drifts slower than the page. The scrim
 * and the CTA below stay put, and that difference is what reads as depth.
 */
export default function VideoHero() {
  const t = useTranslations("landing");

  return (
    <section
      data-header-bg="dark"
      aria-label={t("heroLabel")}
      className="relative h-[86vh] min-h-[34rem] w-full overflow-hidden bg-ink"
    >
      <HeroParallax>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/hero-poster.webp"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      </HeroParallax>

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
