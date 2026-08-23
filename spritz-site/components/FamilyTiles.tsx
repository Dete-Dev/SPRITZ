"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { animate, splitText, stagger, utils } from "animejs";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StripeBand } from "@/components/ui/vandal";
import { SCENTS, type ScentFamily } from "@/lib/scents";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Dossier's Women/Men/Unisex category tiles, recast as the four scent
 * families (SPRITZ has bottle photography, not model photography). Each
 * tile deep-links into the shop with that family pre-filtered. Hovering
 * ripples the family word letter by letter (anime.js splitText).
 */
const TILES: { family: ScentFamily; scentKey: string }[] = [
  { family: "fresh", scentKey: "mer-bergamote" },
  { family: "floral", scentKey: "rose-jasmin" },
  { family: "warm", scentKey: "oud-santal" },
  { family: "sweet", scentKey: "vanille-cafe" },
];

function TileWord({ word }: { word: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const charsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const split = splitText(ref.current, { chars: true, words: false });
    charsRef.current = split.chars as HTMLElement[];
    return () => {
      split.revert();
    };
  }, [word]);

  function ripple() {
    const chars = charsRef.current;
    if (chars.length === 0) return;
    utils.remove(chars);
    animate(chars, {
      translateY: [0, -10, 0],
      duration: 450,
      delay: stagger(28),
      ease: "inOutQuad",
    });
  }

  return (
    <span ref={ref} onMouseEnter={ripple} className="inline-block">
      {word}
    </span>
  );
}

export default function FamilyTiles() {
  const t = useTranslations("families");

  return (
    <section className="bg-paper-2 px-gutter py-section">
      <div className="mx-auto max-w-6xl">
        <p className="sp-eyebrow">{t("eyebrow")}</p>

        <ul className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {TILES.map(({ family, scentKey }) => {
            const scent = SCENTS.find((s) => s.key === scentKey);
            if (!scent) return null;
            return (
              <li key={family}>
                <Link
                  href={`/shop?family=${family}`}
                  className="sp-lift group block overflow-hidden rounded-card border-2 border-ink bg-paper shadow-hard-sm"
                >
                  {/* Matches the hero shots' ratio — no crop, tall Dossier tile. */}
                  <div className="relative aspect-[1/1.9] w-full">
                    <Image
                      src={scent.hero}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-[900ms] ease-spritz group-hover:scale-[1.05]"
                    />
                  </div>
                  <StripeBand color={scent.stripe} height={8} />
                  <p className="sp-display px-3 py-3 text-[clamp(1.3rem,2.6vw,2rem)]">
                    <TileWord word={t(`names.${family}`)} />
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
