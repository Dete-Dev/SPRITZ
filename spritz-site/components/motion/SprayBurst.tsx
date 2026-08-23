"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";

/** Clip time is fully spent by this much of the act, leaving the rest quiet. */
const BURST_END = 0.35;

/**
 * The signature move: the page sprays.
 *
 * SPRITZ is a spray, so the one thing this site does that others do not is
 * atomise its own peak. As the split promo pins, a plume blows across the seam
 * between the two choices, driven frame by frame off the wheel.
 *
 * Three things make it work rather than look like a stuck video:
 *
 *  - The clip is shot on black and composited with `screen`, so the black
 *    drops out and only the mist lands on the panels. It is an overlay
 *    element, not a scene, and it is used as one.
 *  - `spray-scrub.mp4` is re-encoded all-intra, so every frame is a keyframe
 *    and scrubbing backwards costs the same as forwards. The original is one
 *    long GOP and would thrash the decoder the moment anyone scrolled up.
 *  - Seeks are written from a motion-value subscription and skipped while one
 *    is still in flight. Queuing them from a frame loop posts them faster than
 *    the decoder retires them, and the picture freezes.
 *
 * Takes the raw scroll progress, never the spring: a spring here would make
 * the plume trail the hand that is spraying it.
 */
export default function SprayBurst({
  progress,
}: {
  /** Raw 0-1 progress of the pinned act. */
  progress: MotionValue<number>;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  // Decoders will not seek a video that has never been told to play. One muted
  // play/pause on mount primes it, so the first scroll paints a frame instead
  // of nothing.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.play().then(() => el.pause()).catch(() => {});
  }, []);

  useMotionValueEvent(progress, "change", (value) => {
    const el = ref.current;
    if (!el || el.seeking || el.readyState < 2) return;
    const span = el.duration || 2.5;
    const t = Math.min(1, Math.max(0, value / BURST_END)) * span;
    // A seek under a frame is invisible and only costs a decode.
    if (Math.abs(el.currentTime - t) < 1 / 60) return;
    el.currentTime = t;
  });

  // Capped well below 1. At full strength the plume is a full-frame wash and
  // the cream headline underneath stops holding contrast, which is the exact
  // failure a scrim is supposed to prevent. It reads as atmosphere at 0.6 and
  // as fog at 1. Measured against the headline strip, not judged by eye.
  const opacity = useTransform(
    progress,
    [0, 0.04, BURST_END - 0.07, BURST_END + 0.03],
    [0, 0.45, 0.45, 0],
  );

  return (
    <motion.video
      ref={ref}
      aria-hidden
      muted
      playsInline
      preload="auto"
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover mix-blend-screen"
      src="/video/spray-scrub.mp4"
    />
  );
}
