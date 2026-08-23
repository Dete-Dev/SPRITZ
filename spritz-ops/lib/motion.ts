/* VENDORED from spritz-site/lib/motion.ts by scripts/sync-ds.mjs — do not edit here. */
/**
 * Anime.js helpers. Scroll smoothing stays Lenis + framer-motion (locked
 * stack); anime.js is only for what framer is verbose at — stagger bursts,
 * spring pops, letter splits. Client-side only.
 */
import { animate, stagger, createSpring } from "animejs";

/** JS-side reduced-motion gate — anime writes inline styles, so the global
 *  CSS `prefers-reduced-motion` kill-switch in tokens/motion.css can't stop it. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** The house spring: quick, one visible overshoot. */
export const springPop = () => createSpring({ stiffness: 320, damping: 16 });

/**
 * Staggered entrance for a set of cards/tiles. No-ops (and leaves elements
 * fully visible) under reduced motion. Call once when the group scrolls in —
 * pair with the `sp-pre-enter` class so elements start hidden without a flash.
 */
export function enterStagger(els: Element[] | NodeListOf<Element>): void {
  const targets = Array.from(els);
  if (targets.length === 0) return;
  if (prefersReducedMotion()) {
    targets.forEach((el) => el.classList.remove("sp-pre-enter"));
    return;
  }
  targets.forEach((el) => el.classList.remove("sp-pre-enter"));
  animate(targets, {
    opacity: [0, 1],
    translateY: [48, 0],
    scale: [0.94, 1],
    delay: stagger(90),
    ease: springPop(),
  });
}
