"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/**
 * §9 — the survey numbers land instead of just sitting there.
 *
 * The real figure is what renders on the server, so the page is correct with no
 * JavaScript and correct to a crawler. The count only takes over once the band
 * scrolls in, and it runs once.
 *
 * Writing `textContent` rather than a style keeps this off the transform and
 * opacity path entirely, and skips a re-render per frame.
 *
 * Numbers only. Do not reuse this on a price: those go through the `price`
 * message so the two locales can format them differently, and counting would
 * bypass that.
 */
export default function CountUp({
  to,
  duration = 1.4,
}: {
  /** The real, final figure. Never a number invented to look good. */
  to: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduce) {
      el.textContent = String(to);
      return;
    }

    // Reset to zero before the band is ever on screen. This section sits just
    // above the footer, so it is never in the first paint and the reset is not
    // something a visitor can catch.
    if (!inView) {
      el.textContent = "0";
      return;
    }

    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => {
        el.textContent = String(Math.round(value));
      },
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);

  return <span ref={ref}>{to}</span>;
}
