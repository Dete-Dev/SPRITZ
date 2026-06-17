"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * Reveals children with a soft lift + fade once they enter the viewport.
 * Driven by Framer Motion's useInView + variants.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof typeof motion;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "0px 0px -80px 0px",
    amount: 0.15,
  });

  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
        delay: delay / 1000,
      }}
    >
      {children}
    </Component>
  );
}
