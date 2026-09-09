"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import SprayBurst from "@/components/motion/SprayBurst";

/**
 * The pinned stage — the home page's one engineered peak.
 *
 * The outer element is three viewport-heights tall; the frame inside sticks to
 * the top for all three while the two panels counter-drift against each other.
 * The whole page keeps moving until it reaches here, and then it holds.
 *
 * Three deliberate constraints:
 *
 *  - Desktop only. On a phone the two panels stack, so a full-height frame
 *    would give each one half a screen, which is less room than they have
 *    today. Below `md` this renders exactly the layout that shipped before.
 *  - `svh`, not `vh`. The mobile URL bar collapses mid-scroll and a `vh` frame
 *    jumps when it does. The panel heights are in `svh` too, so their offsets
 *    never depend on the column width the way a percentage margin would.
 *  - No `z-index`. Nothing here needs to win a stacking fight, and the fixed
 *    <BundleBar/> at z-40 must stay on top.
 *
 * Panels arrive as ReactNode props rather than a render prop: functions cannot
 * cross the server/client boundary, so this keeps <SplitPromo/> a server
 * component and ships none of its markup to the browser.
 *
 * The peak also carries the page's signature move, <SprayBurst/>. The method
 * this page follows gives the peak the asset budget, and this is it.
 */
export default function PinFrame({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!wide || reduce) {
    return (
      <div className="grid md:grid-cols-2">
        {left}
        {right}
      </div>
    );
  }

  return <PinnedStage left={left} right={right} />;
}

/**
 * Split out on purpose. <useScroll/> resolves its target in a layout effect
 * that runs once, after this component's own first commit, so the ref has to be
 * attached on the very first render of whatever component owns the hook. When
 * the hook lived in the parent, the first render was the unpinned fallback, the
 * ref was still null when the hook measured, and progress stayed frozen at
 * whatever it read then. Mounting the stage as its own component fixes that,
 * and keeps the scroll listener off the page entirely when it is not pinned.
 */
function PinnedStage({ left, right }: { left: ReactNode; right: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  // 0 when the tall outer element's top meets the viewport top, 1 when its
  // bottom does — exactly the span the frame stays stuck for.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // The house spring. The pin is the one place a spring earns its keep: the
  // panels should feel weighted, not welded to the wheel.
  const p = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 18,
    mass: 0.6,
  });

  // Panels are 118svh tall and hang 9svh above the frame, so a 6% drift each
  // way (about 50px on a laptop) never uncovers an edge. Greet form: both are
  // fully on screen at p = 0, so the stage is never empty while it waits.
  const leftY = useTransform(p, [0, 1], ["-6%", "6%"]);
  const rightY = useTransform(p, [0, 1], ["6%", "-6%"]);

  return (
    <div ref={ref} className="relative h-[300svh]">
      <div className="sticky top-0 grid h-svh grid-cols-2 overflow-hidden">
        <motion.div
          className="-mt-[9svh] h-[118svh] will-change-transform"
          style={{ y: leftY }}
        >
          {left}
        </motion.div>
        <motion.div
          className="-mt-[9svh] h-[118svh] will-change-transform"
          style={{ y: rightY }}
        >
          {right}
        </motion.div>

        {/* The page's one bespoke move. Raw progress, not the spring: the
            plume should answer the wheel directly. */}
        <SprayBurst progress={scrollYProgress} />
      </div>
    </div>
  );
}
