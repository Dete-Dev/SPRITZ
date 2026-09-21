/* VENDORED from spritz-site/components/ui/Cta.tsx by scripts/sync-ds.mjs — do not edit here. */
import Link from "next/link";

/**
 * SPRITZ CTA — the only button on the platform.
 *
 * Variants map 1:1 to the `.sp-cta--*` classes in globals.css:
 *   primary        — red pill, the default ask
 *   ghost          — outlined ink, the secondary ask on paper
 *   invert         — white pill, for use over video / ink backgrounds
 *   outline-invert — outlined white, the secondary ask on dark
 *
 * Renders an <a> when `href` is set, otherwise a <button>.
 */
type Variant = "primary" | "ghost" | "invert" | "outline-invert";

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  size?: "md" | "sm";
  block?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  "aria-label"?: string;
};

function classes(
  variant: Variant,
  size: "md" | "sm",
  block: boolean,
  extra: string,
) {
  return [
    "sp-cta",
    `sp-cta--${variant}`,
    size === "sm" ? "sp-cta--sm" : "",
    block ? "sp-cta--block" : "",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function Cta({
  children,
  href,
  variant = "primary",
  size = "md",
  block = false,
  className = "",
  onClick,
  type = "button",
  ...rest
}: Props) {
  const cn = classes(variant, size, block, className);

  if (href) {
    // External and in-page anchors skip the locale-aware router.
    const external = href.startsWith("http") || href.startsWith("#");
    if (external) {
      return (
        <a href={href} className={cn} onClick={onClick} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cn} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cn} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
