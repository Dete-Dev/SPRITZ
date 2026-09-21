"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * §1 — the hero film drifts slower than the page it sits in.
 *
 * The scrim and the CTA stay put, so the differential between them and the
 * moving film is what reads as depth. That is the whole device; the video keeps
 * its own autoplay loop and is never scrubbed.
 *
 * The inner layer is 10% oversized on every edge so an 8% drift can never
 * uncover one. No spring: Lenis already smooths the wheel, and a spring here
 * makes the film visibly lag the scrim drawn on top of it, which reads as a
 * rendering fault rather than as weight.
 */
export default function HeroParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  // 0 at the top of the page, 1 once the hero's bottom edge reaches the top.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  if (reduce) {
    return <div className="absolute inset-0">{children}</div>;
  }

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-[-10%] will-change-transform"
        style={{ y, scale }}
      >
        {children}
      </motion.div>
    </div>
  );
}
