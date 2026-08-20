import Image from "next/image";
import { Link } from "@/i18n/navigation";
import LabelName from "@/components/ui/LabelName";
import { StripeBand, Sticker } from "@/components/ui/vandal";
import type { Scent } from "@/lib/scents";

/**
 * The product card. Everywhere a scent appears in a grid — the five on the
 * home page, the shop, "more from the five" — it is this card.
 *
 * Vandal treatment: 2px ink border, near-square corners, hard offset shadow,
 * and the scent's own stripe colourway banded across the bottom of the image.
 * Hovering lifts it and hardens the shadow (`.sp-lift`), so it reads as a
 * sticker pasted on the page rather than a floating panel.
 */
export default function ScentCard({
  scent,
  priceLabel,
  note,
  inspiredByLabel,
  badge,
  badgeFill,
  priority = false,
}: {
  scent: Scent;
  /** Formatted price, e.g. "420 lei". */
  priceLabel: string;
  /** Short note line under the name. */
  note?: string;
  /** "inspired by <designer>" — the whole dupe pitch, already localised. */
  inspiredByLabel?: string;
  /** Optional corner sticker ("Bestseller", "Nou"). */
  badge?: string;
  badgeFill?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/scents/${scent.key}`}
      aria-label={scent.name}
      className="group flex h-full flex-col"
    >
      <div className="sp-lift relative overflow-hidden rounded-card border-2 border-ink bg-paper shadow-hard-sm">
        {badge ? (
          <Sticker
            tilt={4}
            variant="fill"
            fill={badgeFill ?? scent.stripe}
            className="absolute right-3 top-3 z-10"
          >
            {badge}
          </Sticker>
        ) : null}

        <div className="relative aspect-[1/1.15] w-full bg-paper">
          <Image
            src={scent.clean}
            alt={scent.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-4 transition-transform duration-[900ms] ease-spritz group-hover:scale-[1.04]"
          />
        </div>

        <StripeBand color={scent.stripe} height={12} />
      </div>

      <p className="mt-3 text-[15px] leading-snug">
        <LabelName name={scent.name} noteWords={scent.noteWords} />
      </p>
      {inspiredByLabel ? (
        /* Tighter tracking than a standard eyebrow — designer names run long
           and the dupe line must not outshout the product name. */
        <p className="mt-1 font-sans text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-muted">
          {inspiredByLabel}
        </p>
      ) : null}
      {note ? (
        <p className="mt-1.5 font-sans text-sm text-muted">{note}</p>
      ) : null}
      {/* mt-auto keeps every price on the same baseline across a ragged row. */}
      <p className="mt-auto pt-2 font-sans text-[15px] font-bold">{priceLabel}</p>
    </Link>
  );
}
