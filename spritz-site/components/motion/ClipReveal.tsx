"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * §4 — a wipe, not a fade.
 *
 * A `clip-path` eating up from the bottom edge reads as a change of state,
 * which is what this beat is: three closed doors becoming three open ones. It
 * runs across the whole row at once rather than per tile, because a wipe that
 * covers a full-bleed band is a transition and a wipe on a small element is a
 * fidget.
 *
 * The clip resolves to `none` once the reveal finishes, instead of settling on
 * `inset(0)`. They look identical on the tile itself, but `inset(0)` keeps
 * clipping at the border box forever, which would shear the hard offset shadows
 * off the bottom and right of every tile for the rest of the page's life.
 */
export default function ClipReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Complete the wipe by the time the row is a little past halfway across the
  // viewport, so the tiles are settled and clickable well before they leave.
  const clipPath = useTransform(scrollYProgress, (value) => {
    const t = Math.min(1, Math.max(0, (value - 0.1) / 0.45));
    return t >= 1 ? "none" : `inset(${((1 - t) * 100).toFixed(2)}% 0 0 0)`;
  });

  if (reduce) return <>{children}</>;

  return (
    <motion.div ref={ref} style={{ clipPath }} className="will-change-[clip-path]">
      {children}
    </motion.div>
  );
}
