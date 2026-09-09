"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { StripeBand } from "@/components/ui/vandal";

/**
 * Scroll-driven marquee. In v2 this is a full-bleed shout: display type at
 * 900 weight banded top and bottom by the label stripe, drifting left as the
 * section crosses the viewport. Aria-hidden — it repeats a line the page has
 * already said, so screen readers skip it.
 */
export default function MarqueeQuote({ text }: { text: string }) {
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    mass: 0.5,
  });

  // As the section travels from below to above the viewport, drift left.
  const x = useTransform(smooth, [0, 1], [200, -600]);

  return (
    <section
      ref={ref}
      aria-hidden
      className="relative overflow-hidden bg-paper-2 pb-16 pt-0 md:pb-20"
    >
      <StripeBand color="var(--sp-yellow)" height={14} className="mb-10" />

      <motion.div
        className="sp-display whitespace-nowrap text-[clamp(3rem,10vw,10rem)] text-ink will-change-transform"
        style={{ x }}
      >
        <span className="mr-14">{text}</span>
        <span className="mr-14 text-red">{text}</span>
        <span className="mr-14">{text}</span>
        <span className="text-red">{text}</span>
      </motion.div>

    </section>
  );
}
