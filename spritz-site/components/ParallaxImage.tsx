"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Scroll-driven parallax image powered by Framer Motion.
 * `speed` is the multiplier — positive moves opposite scroll, negative with scroll.
 *
 * No spring on the progress: Lenis already smooths the wheel, and a second
 * smoothing pass only makes the layer lag the frame it sits in.
 *
 * Reduced motion is handled here rather than at the call site. Framer writes
 * the offset as an inline transform, which the global CSS kill-switch in
 * app/tokens/motion.css cannot reach.
 */
export default function ParallaxImage({
  src,
  alt,
  speed = 0.25,
  className = "",
  imageClassName = "object-cover",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  /** Full-bleed callers need to say so, or they download a half-width crop. */
  sizes?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  // 0 when the element enters the viewport bottom, 1 when it leaves the top
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map 0..1 to a y offset based on speed.
  // At speed = 0.25, image drifts ~50px across the whole crossing.
  const offset = 200 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className={
          reduce ? "absolute inset-[-15%]" : "absolute inset-[-15%] will-change-transform"
        }
        style={reduce ? undefined : { y }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={imageClassName}
        />
      </motion.div>
    </div>
  );
}
