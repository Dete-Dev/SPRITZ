import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SCENTS, SCENT_KEYS } from "@/lib/scents";
import ScentGallery from "@/components/scent/ScentGallery";
import BuyBox from "@/components/scent/BuyBox";
import NotesPyramid from "@/components/scent/NotesPyramid";
import MoreFromTheFive from "@/components/scent/MoreFromTheFive";
import SiteFooter from "@/components/SiteFooter";

/**
 * Real product page for a single scent.
 *
 * Layout:
 *   Above-fold:  ScentGallery (left)        |  BuyBox (right, sticky on md+)
 *   Below:       "The story"  — long-form copy in centered column
 *                NotesPyramid — top/heart/base 3-col
 *                "How to wear" — small editorial block
 *                MoreFromTheFive — surfaces the other four scents
 *                SiteFooter
 *
 * Pre-renders one route per (locale × scent) at build time.
 */

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SCENT_KEYS.map((key) => ({ locale, key })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; key: string }>;
}): Promise<Metadata> {
  const { locale, key } = await params;
  const scent = SCENTS.find((s) => s.key === key);
  if (!scent) return { title: "SPRITZ" };
  const tHero = await getTranslations({ locale, namespace: "hero.scents" });
  return {
    title: `SPRITZ — ${scent.name}`,
    description: tHero(`${key}.notes`),
  };
}

export default async function ScentPage({
  params,
}: {
  params: Promise<{ locale: string; key: string }>;
}) {
  const { locale, key } = await params;
  setRequestLocale(locale);
  const scent = SCENTS.find((s) => s.key === key);
  if (!scent) notFound();

  const t = await getTranslations("scentPage");
  const tStory = await getTranslations(`scentDetails.${key}`);

  return (
    <>
      <main
        className="min-h-screen"
        style={{
          background: `linear-gradient(180deg, var(--color-surface) 0%, ${scent.accent}1a 100%)`,
        }}
      >
        {/* Back link */}
        <div className="mx-auto max-w-7xl px-6 md:px-14 pt-28 md:pt-32">
          <Link
            href="/#five"
            className="text-[11px] uppercase tracking-[0.4em] text-ink/55 hover:text-ink"
          >
            {t("back")}
          </Link>
        </div>

        {/* Above the fold: gallery + buy box */}
        <section className="mx-auto max-w-7xl px-6 md:px-14 py-14 md:py-20">
          <div className="grid grid-cols-12 gap-8 md:gap-14 items-start">
            <div className="col-span-12 md:col-span-7">
              <ScentGallery
                images={scent.gallery}
                alt={scent.name}
                accent={scent.accent}
              />
            </div>
            <div className="col-span-12 md:col-span-5">
              <BuyBox scent={scent} />
            </div>
          </div>
        </section>

        {/* The story */}
        <section className="px-6 md:px-14 py-24 md:py-32 bg-bone">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.4em] text-ink/55 mb-6">
              {t("story")}
            </p>
            <p className="font-display text-3xl md:text-4xl leading-[1.15] text-ink mb-6">
              {tStory("story1")}
            </p>
            <p className="text-ink/75 leading-relaxed text-lg max-w-2xl">
              {tStory("story2")}
            </p>
          </div>
        </section>

        {/* Notes pyramid */}
        <section className="px-6 md:px-14 py-24 md:py-32 bg-ivory">
          <div className="mx-auto max-w-6xl mb-14 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.4em] text-ink/55 mb-6">
              {t("notes")}
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.02] mb-5">
              {scent.name}
            </h2>
            <p className="text-ink/70 leading-relaxed max-w-md">
              {t("notesIntro")}
            </p>
          </div>
          <div className="mx-auto max-w-6xl">
            <NotesPyramid scentKey={key} />
          </div>
        </section>

        {/* How to wear */}
        <section
          className="px-6 md:px-14 py-24 md:py-32"
          style={{
            background: `linear-gradient(180deg, ${scent.accent}11 0%, var(--color-surface) 100%)`,
          }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-ink/55 mb-6">
              {t("wear")}
            </p>
            <p className="font-display text-2xl md:text-3xl leading-[1.3] text-ink max-w-2xl mx-auto">
              {t("wearBody")}
            </p>
          </div>
        </section>

        {/* The other four */}
        <MoreFromTheFive excludeKey={key} />
      </main>

      <SiteFooter />
    </>
  );
}
