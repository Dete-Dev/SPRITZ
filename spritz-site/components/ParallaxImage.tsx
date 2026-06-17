"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * Scroll-driven parallax image powered by Framer Motion.
 * `speed` is the multiplier — positive moves opposite scroll, negative with scroll.
 */
export default function ParallaxImage({
  src,
  alt,
  speed = 0.25,
  className = "",
  imageClassName = "object-cover",
  priority = false,
}: {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  // 0 when the element enters the viewport bottom, 1 when it leaves the top
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.3,
  });

  // Map 0..1 to a y offset based on speed.
  // At speed = 0.25, image drifts ~25% of its height across the scroll.
  const offset = 200 * speed;
  const y = useTransform(smooth, [0, 1], [offset, -offset]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-[-15%] will-change-transform"
        style={{ y }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={imageClassName}
        />
      </motion.div>
    </div>
  );
}
