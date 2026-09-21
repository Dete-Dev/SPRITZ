/* VENDORED from spritz-site/components/sectionFade.ts by scripts/sync-ds.mjs — do not edit here. */
import type { CSSProperties } from "react";

/**
 * Returns an inline `background` style for a section so its first `fadePx`
 * pixels fade from the previous section's color into its own solid color.
 *
 * The receiving section uses this in place of a `bg-*` Tailwind class.
 * Because the gradient runs *inside* the section (in its existing top
 * padding), there is no separate transition strip and no dead space at
 * the boundary — the seam is invisible.
 *
 * Interpolation is in OKLCH (perceptually uniform) so even short gradients
 * read smoothly across high-contrast jumps like cream ↔ near-black ink.
 * For the dramatic cream ↔ ink case, pass `via` (e.g. warm taupe `#7a6e60`)
 * to insert a midpoint stop and keep the curve from feeling "muddy" mid-way.
 *
 * @example
 *   <section style={sectionFade({ own: "#f4ede2", from: "#d4c4a5", fadePx: 64 })}>
 *
 * @example   // 3-stop for cream → ink
 *   <section style={sectionFade({
 *     own: "#1a1411", from: "#f4ede2", via: "#7a6e60", fadePx: 128,
 *   })}>
 */
export function sectionFade({
  own,
  from,
  via,
  fadePx = 24,
}: {
  /** This section's solid background color. */
  own: string;
  /** Previous section's color — gradient starts here. Omit for first section. */
  from?: string;
  /** Optional midpoint color (3-stop gradient). */
  via?: string;
  /** Height of the top fade band in pixels. Default 24. Set 0 to disable. */
  fadePx?: number;
}): CSSProperties {
  if (!from || fadePx === 0) {
    return { background: own };
  }
  const stops = via
    ? `${from} 0%, ${via} 50%, ${own} ${fadePx}px, ${own} 100%`
    : `${from} 0%, ${own} ${fadePx}px, ${own} 100%`;
  return {
    background: `linear-gradient(to bottom in oklch, ${stops})`,
  };
}

/** Shared brand palette — single source of truth referenced by page.tsx. */
export const PALETTE = {
  hero: "#d4c4a5",
  ivory: "#f4ede2",
  bone: "#ebe2d2",
  ink: "#1a1411",
  midCreamInk: "#7a6e60",
} as const;
