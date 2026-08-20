"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useTranslations } from "next-intl";
import Cta from "@/components/ui/Cta";
import { Mark, Spray, Sticker } from "@/components/ui/vandal";

/**
 * SPRITZ landing hero — a scroll-driven parallax that lands in a CTA.
 *
 * The section is 220vh tall with a sticky viewport inside it, so scrolling
 * plays a fixed-frame sequence instead of pushing the video off screen:
 *
 *   0.00 – 0.45   headline holds, video eases out of its over-scale
 *   0.35 – 0.65   headline lifts away, scrim deepens toward the ink world
 *   0.55 – 1.00   the CTA panel rises into place — the landing
 *
 * v2 dressing: this is an ink surface, so the copy is cream (never white),
 * a red spray hit sits behind the headline, and one sticker carries the
 * price. That is three vandal elements — the per-viewport ceiling.
 *
 * Video assets: /public/video/hero.{webm,mp4} with hero-poster.webp behind.
 */
export default function VideoHero() {
  const ref = useRef<HTMLElement | null>(null);
  const t = useTranslations("landing");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Springing the raw progress keeps the parallax from tracking wheel jitter.
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  // Video: settles out of an over-scale, drifts up slightly behind the copy.
  const videoScale = useTransform(p, [0, 1], [1.18, 1]);
  const videoY = useTransform(p, [0, 1], ["0%", "-8%"]);

  // Scrim: the film cuts between a candlelit interior and bright daylight
  // skating, so the resting value has to hold cream copy legible over the
  // brightest frame, not the average one. Deepens to near-solid ink by the
  // landing so the CTA panel keeps its contrast.
  const scrim = useTransform(p, [0, 0.55, 1], [0.46, 0.58, 0.84]);

  // Opening copy: parallaxes up and out through the first half.
  const titleY = useTransform(p, [0, 0.6], [0, -160]);
  const titleOpacity = useTransform(p, [0.2, 0.5], [1, 0]);
  const cueOpacity = useTransform(p, [0, 0.12], [1, 0]);

  // Landing CTA: rises in over the second half.
  const ctaY = useTransform(p, [0.5, 0.95], [90, 0]);
  const ctaOpacity = useTransform(p, [0.55, 0.85], [0, 1]);

  return (
    <section
      ref={ref}
      data-header-bg="dark"
      aria-label={t("heroLabel")}
      className="relative h-[220vh] w-full"
    >
      <div className="sp-surface-ink sp-grain sticky top-0 h-screen w-full overflow-hidden">
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/hero-poster.webp"
          style={{ scale: videoScale, y: videoY }}
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </motion.video>

        <motion.div
          aria-hidden
          style={{ opacity: scrim }}
          className="absolute inset-0 bg-ink"
        />

        {/* --- Opening frame ------------------------------------------------ */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center px-gutter text-center text-cream will-change-transform"
        >
          <p className="sp-eyebrow !text-cream/90">{t("eyebrow")}</p>

          <div className="relative mt-5">
            <Spray
              color="var(--sp-red)"
              opacity={0.4}
              className="absolute -left-24 -top-20 h-[26rem] w-[26rem]"
            />
            <h1 className="sp-display relative text-hero">
              {t("heroLine1")}
              <br />
              {t("heroLine2Pre")}{" "}
              <Mark color="var(--sp-yellow)">{t("heroLine2Mark")}</Mark>
            </h1>
          </div>

          <p className="mt-7 max-w-md font-sans text-d-lg text-cream/80">
            {t("heroSub")}
          </p>

          {/* CTA #1 — visible before any scroll. */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Cta href="/shop" variant="primary">
              {t("ctaShop")}
            </Cta>
            <Cta href="#finder" variant="outline-invert">
              {t("ctaFinder")}
            </Cta>
            <Sticker tilt={-5} variant="fill" fill="var(--sp-yellow)">
              {t("fromPrice")}
            </Sticker>
          </div>
        </motion.div>

        <motion.p
          style={{ opacity: cueOpacity }}
          className="sp-eyebrow absolute bottom-8 left-1/2 -translate-x-1/2 !text-cream/80"
        >
          {t("scrollCue")}
        </motion.p>

        {/* --- The landing -------------------------------------------------- */}
        <motion.div
          style={{ y: ctaY, opacity: ctaOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center px-gutter text-center text-cream will-change-transform"
        >
          <p className="sp-eyebrow !text-cream/90">{t("landingEyebrow")}</p>

          <div className="relative mt-5">
            <Spray
              color="var(--sp-pink)"
              opacity={0.35}
              className="absolute -right-20 -top-16 h-80 w-80"
            />
            <h2 className="sp-display relative max-w-4xl text-d-2xl">
              {t("landingTitlePre")}{" "}
              <Mark color="var(--sp-pink)">{t("landingTitleMark")}</Mark>
            </h2>
          </div>

          <p className="mt-6 max-w-lg font-sans text-d-lg text-cream/80">
            {t("landingSub")}
          </p>

          {/* CTA #2 — the one the whole scroll is built to deliver. */}
          <div className="mt-9 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <Cta href="#bundle" variant="primary">
              {t("ctaBundle")}
            </Cta>
            <Cta href="/shop" variant="outline-invert">
              {t("ctaAll")}
            </Cta>
          </div>

          <p className="mt-6 font-sans text-sm text-cream/60">
            {t("landingReassurance")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
