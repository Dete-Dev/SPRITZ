"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link, usePathname } from "@/i18n/navigation";

/**
 * The jumping, colour-cycling SPRITZ mark as background texture: faint,
 * blended into the page, and dead to the pointer. Home page only, because
 * that page is editorial; the shop routes keep a clean field.
 *
 * The brand mark you click lives in the toolbar (<FloatingHeader/>).
 *
 * "Behind the content" is done with blending and opacity, not z-order: every
 * section on this site paints an opaque background (bg-paper, sp-surface-ink),
 * so a mark genuinely behind them would simply never be seen.
 *
 * Implementation note: rendered as a CSS mask-image over an animated
 * `background-color`, NOT as an <img> — that is how one graffiti shape can
 * change colour smoothly.
 */

/** The five loud brand colours, in cycling order. */
const CYCLE = ["#e8b83c", "#f178ac", "#1652c2", "#e5143c", "#16a85f"] as const;

/** Laps through CYCLE per full page scroll. Higher = faster colour change. */
const COLOUR_LAPS = 3;

/** How far below the fold the footer starts the fade, in pixels. */
const FOOTER_LEAD = 900;

const CREAM = "#f4ede2";
const INK = "#0a0a0a";

/** Shared mask styling for both copies of the mark. */
const MASK = {
  aspectRatio: "1600 / 846",
  WebkitMaskImage: "url('/brand/wordmark-sm.webp')",
  maskImage: "url('/brand/wordmark-sm.webp')",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
} as const;

export default function JumpingWordmark() {
  return <RoamingWatermark />;
}

/**
 * The jumping mark as background texture. Same path and the same colour
 * cycle as before — only recessive, and it can never take a click.
 */
function RoamingWatermark() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  const onDark = useHeaderOnDark();

  /* usePathname() is locale-stripped, so the home page is exactly "/". */
  const active = pathname === "/" && !reducedMotion;

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

  /* Colour stops, evenly spaced: resting colour, then COLOUR_LAPS laps of the
     palette, then cream for the ink footer. */
  const [colourStops, colourValues] = useMemo(() => {
    const values = [
      onDark ? CREAM : INK,
      ...Array.from({ length: COLOUR_LAPS }, () => CYCLE).flat(),
      CREAM,
    ];
    const stops = values.map((_, i) => i / (values.length - 1));
    return [stops, values] as const;
  }, [onDark]);

  const backgroundColor = useTransform(progress, colourStops, colourValues);

  if (!active) return null;

  return (
    /* z-10 keeps it under every control (header, pill, menus, bars) while
       still painting over the page's own opaque sections. */
    <div
      aria-hidden
      className="pointer-events-none fixed left-1/2 top-10 z-10 -translate-x-1/2 md:top-14"
    >
      <motion.div
        style={{ x, y, rotate, willChange: "transform" }}
      >
        <motion.div
          className="h-32 opacity-[0.13] md:h-52"
          style={{
            ...MASK,
            backgroundColor,
            mixBlendMode: onDark ? "screen" : "multiply",
          }}
        />
      </motion.div>
    </div>
  );
}

/**
 * True once the footer is close enough to matter. The bottom margin means it
 * flips while the footer is still well below the fold, so the watermark has
 * finished fading by the time anyone sees the footer.
 */
function useNearFooter(pathname: string): boolean {
  const [near, setNear] = useState(false);

  /* Keyed on pathname: this lives in the layout and survives client-side
     navigation, so without it we would keep watching the previous page's
     footer node after a route change.

     IntersectionObserver rather than a scroll listener: the page is already
     scroll-heavy with Lenis and framer springs running, and this costs
     nothing per frame. The bottom rootMargin makes it flip while the footer
     is still well below the fold, so the mark has finished fading before the
     footer wordmark comes into view. */
  useEffect(() => {
    setNear(false);
    const footer = document.querySelector("footer");
    if (!footer) return;

    const io = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: `0px 0px ${FOOTER_LEAD}px 0px` },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, [pathname]);

  return near;
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
