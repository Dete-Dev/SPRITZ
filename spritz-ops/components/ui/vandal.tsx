/* VENDORED from spritz-site/components/ui/vandal.tsx by scripts/sync-ds.mjs — do not edit here. */
/**
 * SPRITZ v2 "Vandal" kit — the signature elements of the design system.
 * Each is a thin typed wrapper over a token class in app/tokens/effects.css.
 *
 * House rule: at most ~3 vandal elements per viewport. Loud, not messy.
 */

/** Sticker slapped on at an angle — hard shadow, scrawl voice. Max ~6 words. */
export function Sticker({
  children,
  tilt = -3,
  variant = "outline",
  fill,
  className = "",
  style,
}: {
  children: React.ReactNode;
  tilt?: number;
  variant?: "outline" | "fill" | "ink";
  /** Fill colour for `fill`, or shadow colour for `ink`. */
  fill?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const cn = [
    "sp-sticker",
    variant === "fill" ? "sp-sticker--fill" : "",
    variant === "ink" ? "sp-sticker--ink" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={cn}
      style={
        {
          "--tilt": `${tilt}deg`,
          ...(fill ? { "--fill": fill } : {}),
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </span>
  );
}

/** Translucent tape strip pinning an element to the page. */
export function Tape({
  rotate = 4,
  width = 110,
  className = "",
  style,
}: {
  rotate?: number;
  width?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={`sp-tape ${className}`}
      style={{ width, transform: `rotate(${rotate}deg)`, ...style }}
    />
  );
}

/** Diagonal label-stripe band (guideline ch.02). Skin it with `color`. */
export function StripeBand({
  color = "var(--sp-red)",
  height = 16,
  thin = false,
  className = "",
  style,
}: {
  color?: string;
  height?: number;
  thin?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={`${thin ? "sp-stripe sp-stripe--thin" : "sp-stripe"} ${className}`}
      style={{ ["--stripe" as string]: color, height, ...style }}
    />
  );
}

/** Radial paint blast behind type or product. Position it absolutely. */
export function Spray({
  color = "var(--sp-red)",
  opacity = 0.45,
  className = "",
  style,
}: {
  color?: string;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={`sp-spray ${className}`}
      style={{ ["--spray" as string]: color, opacity, ...style }}
    />
  );
}

/** Marker swipe under a word. Wraps inline text. */
export function Mark({
  children,
  color = "var(--sp-yellow)",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span className="sp-mark" style={{ ["--mark" as string]: color }}>
      {children}
    </span>
  );
}
