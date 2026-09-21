"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LabelName from "@/components/ui/LabelName";
import { Mark, Sticker } from "@/components/ui/vandal";
import { SCENTS } from "@/lib/scents";
import { enterStagger } from "@/lib/motion";

/**
 * "Latest drops" — Dossier's editorial drop row, vandal-ised. Four tall
 * cards, full-bleed hero shot, the scent's own colourway as the name band.
 * Cards burst in with an anime.js spring stagger the first time the row
 * scrolls into view (framer stays on scroll duty; this is a one-shot pop).
 */
const DROP_KEYS = [
  "truffe-chocolat",
  "safran-ambre",
  "cerise-rose",
  "ananas-bouleau",
] as const;

export default function LatestDrops() {
  const t = useTranslations("drops");
  const tCommon = useTranslations("common");
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        enterStagger(list.querySelectorAll(":scope > li"));
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(list);
    return () => io.disconnect();
  }, []);

  const drops = DROP_KEYS.map(
    (key) => SCENTS.find((s) => s.key === key),
  ).filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <section className="bg-paper px-gutter py-section">
      <div className="mx-auto max-w-6xl">
        <p className="sp-eyebrow">{t("eyebrow")}</p>
        <h2 className="sp-display mt-5 text-d-2xl">
          {t("headline")} <Mark color="var(--sp-pink)">{t("headlineEm")}</Mark>
        </h2>

        <ul
          ref={listRef}
          className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4"
        >
          {drops.map((scent, idx) => (
            <li key={scent.key} className="sp-pre-enter">
              <Link
                href={`/scents/${scent.key}`}
                aria-label={scent.name}
                className="sp-lift group relative block overflow-hidden rounded-card border-2 border-ink bg-paper shadow-hard"
              >
                {idx === 0 ? (
                  <Sticker
                    tilt={5}
                    variant="fill"
                    fill="var(--sp-yellow)"
                    className="absolute right-3 top-3 z-10"
                  >
                    {t("newBadge")}
                  </Sticker>
                ) : null}

                {/* 1/1.9 ≈ the hero shots' own ratio, so object-cover fills
                    without beheading the bottle. */}
                <div className="relative aspect-[1/1.9] w-full">
                  <Image
                    src={scent.hero}
                    alt={scent.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-[900ms] ease-spritz group-hover:scale-[1.05]"
                  />
                </div>

                {/* Name band in the scent's own colourway, DUPPÉ-style. */}
                <div
                  className="border-t-2 border-ink px-3 py-2.5"
                  style={{ backgroundColor: scent.accent }}
                >
                  <p className="text-[13px] leading-snug md:text-[15px]">
                    <LabelName name={scent.name} noteWords={scent.noteWords} />
                  </p>
                  <p className="mt-1 font-sans text-xs font-bold uppercase tracking-[0.08em]">
                    {tCommon("price", { price: scent.price })}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
