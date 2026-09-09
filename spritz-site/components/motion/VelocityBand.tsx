"use client";

import type { ReactNode } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from "framer-motion";

/**
 * §2 and §5 — the marquee surges with the wheel.
 *
 * The endless loop stays a CSS animation on `.sp-ticker__track`. This adds a
 * second, velocity-driven offset on a wrapper *around* the tracks, so the two
 * transforms compose instead of fighting: a CSS animation wins over an inline
 * style on the same element, which is why the offset cannot live on the track.
 *
 * The clip stays on `.sp-ticker` outside this wrapper, so the band's own edges
 * never move and the strip keeps its straight border.
 *
 * `direction` runs the two bands opposite ways. They share a device but must
 * not read as the same strip.
 */
export default function VelocityBand({
  children,
  direction = 1,
}: {
  children: ReactNode;
  /** 1 pushes with the scroll, -1 against it. */
  direction?: 1 | -1;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);

  // Raw velocity jumps hard between frames. The spring is what turns it into a
  // surge rather than a twitch, and it settles back to zero on its own when the
  // wheel stops.
  const smooth = useSpring(velocity, { stiffness: 260, damping: 45, mass: 0.4 });

  // Clamped: a trackpad fling can report far more than 2500px/s, and the band
  // should surge, not teleport.
  const x = useTransform(
    smooth,
    [-2500, 0, 2500],
    [70 * direction, 0, -70 * direction],
    { clamp: true },
  );

  if (reduce) return <>{children}</>;

  return (
    // `flex-none`: this is now the single flex item inside `.sp-ticker`, and a
    // shrinkable item would be squeezed to the container width, collapsing the
    // tracks that are meant to overflow it.
    <motion.div className="flex flex-none will-change-transform" style={{ x }}>
      {children}
    </motion.div>
  );
}
