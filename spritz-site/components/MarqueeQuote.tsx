"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * Horizontally drifting headline driven by scroll progress through the section.
 * Powered by Framer Motion useScroll + useTransform.
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

  // As section travels from below to above viewport, drift the text left
  const x = useTransform(smooth, [0, 1], [200, -400]);

  return (
    <section
      ref={ref}
      aria-hidden
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <motion.div
        className="font-display text-[clamp(3rem,9vw,9rem)] leading-none text-ink/85 whitespace-nowrap will-change-transform"
        style={{ x }}
      >
        <em className="italic mr-12">{text}</em>
        <em className="italic mr-12">{text}</em>
        <em className="italic">{text}</em>
      </motion.div>
    </section>
  );
}
