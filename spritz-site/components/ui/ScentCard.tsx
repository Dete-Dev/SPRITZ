"use client";

import { useRef } from "react";
import Image from "next/image";
import { animate, stagger, utils } from "animejs";
import { Link } from "@/i18n/navigation";
import LabelName from "@/components/ui/LabelName";
import { StripeBand, Sticker } from "@/components/ui/vandal";
import { prefersReducedMotion, springPop } from "@/lib/motion";
import { fragranticaUrl } from "@/lib/scents";
import type { Scent } from "@/lib/scents";

/**
 * The product card. Everywhere a scent appears in a grid — the five on the
 * home page, the shop, "more from the five" — it is this card.
 *
 * Vandal treatment: 2px ink border, near-square corners, hard offset shadow,
 * and the scent's own stripe colourway banded across the bottom of the image.
 * Hovering lifts it and hardens the shadow (`.sp-lift`), so it reads as a
 * sticker pasted on the page rather than a floating panel — and the note
 * words pop out around the bottle as tilted stickers (anime.js spring;
 * pointer devices only, skipped under reduced motion).
 */

/** Fixed sticker slots around the bottle, up to three note words. */
const NOTE_SLOTS = [
  { className: "left-1 top-16", tilt: -6 },
  { className: "right-0 top-[42%]", tilt: 5 },
  { className: "left-3 bottom-12", tilt: -3 },
] as const;

export default function ScentCard({
  scent,
  priceLabel,
  note,
  inspiredByLabel,
  savingsLabel,
  badge,
  badgeFill,
  genderLabel,
  fragranticaLabel,
  priority = false,
}: {
  scent: Scent;
  /** Formatted price, e.g. "420 lei". */
  priceLabel: string;
  /** Short note line under the name. */
  note?: string;
  /** "inspired by <designer>" — the whole dupe pitch, already localised. */
  inspiredByLabel?: string;
  /** DUPPÉ-style banner over the image foot: "€230 cheaper than the original". */
  savingsLabel?: string;
  /** Optional corner sticker ("Bestseller", "Nou"). */
  badge?: string;
  badgeFill?: string;
  /** Localised gender tag shown on the shot — brief §11. */
  genderLabel?: string;
  /** Screen-reader label for the Fragrantica lookup on the designer name. */
  fragranticaLabel?: string;
  priority?: boolean;
}) {
  const imageRef = useRef<HTMLDivElement | null>(null);

  function scatterNotes(show: boolean) {
    const host = imageRef.current;
    if (!host || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    const targets = host.querySelectorAll(".sp-note-pop");
    if (targets.length === 0) return;
    utils.remove(targets);
    if (show) {
      animate(targets, {
        opacity: [0, 1],
        scale: [0.4, 1],
        delay: stagger(70),
        ease: springPop(),
      });
    } else {
      animate(targets, {
        opacity: 0,
        scale: 0.4,
        duration: 180,
        ease: "outQuad",
      });
    }
  }

  return (
    /* The card is a plain element, not one big anchor: the designer name
       carries its own outbound Fragrantica link and an <a> cannot nest. */
    <div className="group flex h-full flex-col">
      <Link
        href={`/scents/${scent.key}`}
        aria-label={scent.name}
        className="sp-lift relative block overflow-hidden rounded-card border-2 border-ink bg-paper shadow-hard-sm"
      >
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

        {/* Brief §11 — every shot carries who it is for. */}
        {genderLabel ? (
          <span className="absolute left-3 top-3 z-10 rounded-full border-2 border-ink bg-paper px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.12em] text-ink">
            {genderLabel}
          </span>
        ) : null}

        <div
          ref={imageRef}
          onMouseEnter={() => scatterNotes(true)}
          onMouseLeave={() => scatterNotes(false)}
          className="relative aspect-[1/1.15] w-full bg-paper"
        >
          <Image
            src={scent.clean}
            alt={scent.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-4 transition-transform duration-[900ms] ease-spritz group-hover:scale-[1.04]"
          />

          {/* Note words, hidden until hover scatters them in. aria-hidden:
              they repeat words already inside the visible label name. */}
          {scent.noteWords.slice(0, NOTE_SLOTS.length).map((word, i) => (
            <span
              key={word}
              aria-hidden
              className={`sp-note-pop pointer-events-none absolute z-10 opacity-0 ${NOTE_SLOTS[i].className}`}
            >
              <Sticker tilt={NOTE_SLOTS[i].tilt} variant="fill" fill={scent.stripe}>
                {word}
              </Sticker>
            </span>
          ))}

          {savingsLabel ? (
            <p className="absolute inset-x-0 bottom-0 z-10 bg-ink px-2 py-1.5 text-center font-sans text-[9px] font-bold uppercase leading-tight tracking-[0.12em] text-paper">
              {savingsLabel}
            </p>
          ) : null}
        </div>

        <StripeBand color={scent.stripe} height={12} />
      </Link>

      <Link
        href={`/scents/${scent.key}`}
        className="mt-3 text-[15px] leading-snug"
      >
        <LabelName name={scent.name} noteWords={scent.noteWords} />
      </Link>
      {inspiredByLabel ? (
        /* Tighter tracking than a standard eyebrow — designer names run long
           and the dupe line must not outshout the product name. Brief §11:
           the designer name opens its Fragrantica entry. */
        <p className="mt-1 font-sans text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-muted">
          <a
            href={fragranticaUrl(scent.inspiredBy)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={fragranticaLabel}
            className="underline decoration-dotted underline-offset-2 transition-colors hover:text-ink"
          >
            {inspiredByLabel}
          </a>
        </p>
      ) : null}
      {note ? (
        <p className="mt-1.5 font-sans text-sm text-muted">{note}</p>
      ) : null}
      {/* mt-auto keeps every price on the same baseline across a ragged row. */}
      <p className="mt-auto pt-2 font-sans text-[15px] font-bold">{priceLabel}</p>
    </div>
  );
}
