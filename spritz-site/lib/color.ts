/**
 * Text colour for a filled sticker.
 *
 * `.sp-sticker--fill` hardcodes near-black text, which is fine for the
 * decorative hover note words but not for the price: about nine of the 22
 * stripe colours in lib/scents.ts are dark enough that black on them lands
 * under 3.5:1, well below the 4.5:1 AA needs at the sticker's 12px bold.
 */

const INK = "#0a0a0a";
const CREAM = "#f4ede2";

/** WCAG 2.1 relative luminance. Input must be #rgb or #rrggbb. */
function luminance(hex: string): number {
  const raw = hex.trim().replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;

  const channels = [0, 2, 4].map((i) => {
    const v = parseInt(full.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a: number, b: number): number {
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Ink on light fills, cream on dark ones — whichever actually reads. Falls
 * back to ink for anything that is not a parseable hex, matching the CSS
 * default rather than inventing a colour.
 */
export function readableInk(fill: string): string {
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(fill.trim())) return INK;

  const bg = luminance(fill);
  return contrast(bg, luminance(INK)) >= contrast(bg, luminance(CREAM))
    ? INK
    : CREAM;
}
