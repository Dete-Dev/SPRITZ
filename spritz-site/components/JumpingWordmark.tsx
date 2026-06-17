"use client";

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
 * Color: 7-stop framer interpolation through ink → ananas → cerise →
 * menthe → safran → truffe → ivory. Ink at the top is the brand default
 * (high contrast on the cream gradient); ivory at the bottom matches the
 * dark footer area so the wordmark stays visible end-to-end.
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
  const backgroundColor = useTransform(progress, [...COLOR_STOPS], [
    "#1a1411", // ink — brand default at header
    "#d9b675", // ananas — warm cream-yellow
    "#e89bb4", // cerise — soft pink
    "#7ec4b7", // menthe — muted teal
    "#c45a4f", // safran — brick red
    "#8a6238", // truffe — walnut brown
    "#f4ede2", // ivory — keeps wordmark visible on the dark footer
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
