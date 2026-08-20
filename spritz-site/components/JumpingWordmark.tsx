"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Link } from "@/i18n/navigation";

/**
 * SPRITZ floating wordmark — jumps across the viewport AND color-cycles
 * through the five scent label tones as the user scrolls.
 *
 * Position: 6-stop spring-damped jump path (top-center → upper-right →
 * middle-left → lower-right → upper-left → back to top-center).
 *
 * Color: 7-stop framer interpolation through the five brand colours, ending
 * cream so the mark stays visible on the ink footer. The first stop is the
 * resting colour at the top of the page — ink on paper sections, cream when
 * the header sits over an ink section (v2 opens on the ink video hero, where
 * a black mark would disappear).
 *
 * Implementation note: the wordmark is rendered as a CSS mask-image over
 * an animated `background-color`, NOT as an <img>. This is how a single
 * graffiti shape can change color smoothly — the PNG/WebP supplies the
 * silhouette, the bg-color supplies the fill, framer-motion drives the
 * fill through the color stops.
 */
export default function JumpingWordmark() {
  const t = useTranslations("header");
  const { scrollYProgress } = useScroll();

  // <HeaderThemeWatcher/> toggles `.header-on-dark` on <html> whenever an
  // ink section is under the header. The wordmark's fill is an inline motion
  // style, so CSS can't theme it — read the class instead.
  const onDark = useHeaderOnDark();

  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 18,
    mass: 0.6,
  });

  // Position stops — anchor (top-center) + 4 jump points + return to anchor.
  const POS_STOPS = [0, 0.2, 0.4, 0.6, 0.8, 1] as const;

  const x = useTransform(progress, [...POS_STOPS], [
    "0vw",
    "28vw",
    "-30vw",
    "30vw",
    "-28vw",
    "0vw",
  ]);
  const y = useTransform(progress, [...POS_STOPS], [
    "0vh",
    "22vh",
    "44vh",
    "62vh",
    "30vh",
    "0vh",
  ]);
  const rotate = useTransform(progress, [...POS_STOPS], [0, -7, 11, -9, 6, 0]);

  // Color stops — independent from position so all 5 scent colors fit.
  const COLOR_STOPS = [0, 0.167, 0.333, 0.5, 0.667, 0.833, 1] as const;
  // v2 runs the five brand colours loud rather than the muted label tints.
  const backgroundColor = useTransform(progress, [...COLOR_STOPS], [
    onDark ? "#f4ede2" : "#0a0a0a", // resting colour: cream on ink, ink on paper
    "#e8b83c", // yellow — ananas colourway
    "#f178ac", // pink — cerise
    "#1652c2", // blue — menthe
    "#e5143c", // red — safran
    "#16a85f", // green — truffe
    "#f4ede2", // cream — keeps the wordmark visible on the ink footer
  ]);

  return (
    <motion.div
      className="pointer-events-auto fixed left-1/2 top-6 z-50 -translate-x-1/2 md:top-8"
      style={{ x, y, rotate, willChange: "transform" }}
    >
      <Link href="/" aria-label={t("home")} className="block">
        {/* Wordmark rendered via CSS mask so its color can animate.
            aspect-ratio matches wordmark-sm.webp (1600 × 846 → ~1.891 : 1). */}
        <motion.div
          aria-hidden
          className="h-10 md:h-12"
          style={{
            backgroundColor,
            aspectRatio: "1600 / 846",
            WebkitMaskImage: "url('/brand/wordmark-sm.webp')",
            maskImage: "url('/brand/wordmark-sm.webp')",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      </Link>
    </motion.div>
  );
}

/** True while `<html>` carries `.header-on-dark`. */
function useHeaderOnDark(): boolean {
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const sync = (): void =>
      setOnDark(root.classList.contains("header-on-dark"));

    sync();
    const obs = new MutationObserver(sync);
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return onDark;
}
