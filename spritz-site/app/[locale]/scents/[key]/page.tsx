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
import LabelName from "@/components/ui/LabelName";
import { Spray, StripeBand } from "@/components/ui/vandal";

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
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    title: `SPRITZ — ${scent.name}`,
    description: `${scent.name} — ${t("inspiredBy", { name: scent.inspiredBy })}. 50ml eau de parfum, €${scent.price}.`,
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
  const tCommon = await getTranslations("common");
  // Only the five with `hasStory` carry hand-written editorial and a full note
  // pyramid. The rest render from label facts alone rather than inventing copy.
  const tStory = scent.hasStory
    ? await getTranslations(`scentDetails.${key}`)
    : null;

  return (
    <>
      {/* Bottles sit on plain paper white — no gradient behind product
          (design system rule 5). The scent's identity is carried by its
          stripe colourway and one spray hit instead. */}
      <main className="relative min-h-screen overflow-hidden bg-paper">
        <StripeBand
          color={scent.stripe}
          height={14}
          className="fixed inset-x-0 top-0 z-30"
        />

        {/* Back link */}
        <div className="mx-auto max-w-7xl px-gutter pt-28 md:pt-32">
          <Link href="/shop" className="sp-eyebrow hover:text-ink">
            {t("back")}
          </Link>
        </div>

        {/* Above the fold: gallery + buy box */}
        <section className="relative mx-auto max-w-7xl px-gutter py-14 md:py-20">
          <Spray
            color={scent.stripe}
            opacity={0.25}
            className="absolute -left-20 top-0 h-[30rem] w-[30rem]"
          />
          <div className="relative grid grid-cols-12 items-start gap-8 md:gap-14">
            <div className="col-span-12 md:col-span-7">
              <ScentGallery
                images={scent.gallery}
                alt={scent.name}
                stripe={scent.stripe}
              />
            </div>
            <div className="col-span-12 md:col-span-5">
              <BuyBox scent={scent} />
            </div>
          </div>
        </section>

        {/* The story — the one ink beat on the product page. Shown only for
            scents that have real editorial written for them. */}
        {tStory ? (
          <section
            data-header-bg="dark"
            className="sp-surface-ink sp-grain relative px-gutter py-section"
          >
            <div className="mx-auto max-w-3xl">
              <p className="sp-eyebrow">{t("story")}</p>
              <p className="sp-display mt-5 text-d-xl">{tStory("story1")}</p>
              <p className="mt-6 max-w-2xl font-sans text-d-lg text-cream/80">
                {tStory("story2")}
              </p>
            </div>
          </section>
        ) : null}

        {/* Notes pyramid */}
        <section className="bg-paper px-gutter py-section">
          <div className="mx-auto mb-12 max-w-6xl">
            <p className="sp-eyebrow">{t("notes")}</p>
            <h2 className="sp-display mt-5 text-d-2xl lowercase">
              <LabelName name={scent.name} noteWords={scent.noteWords} />
            </h2>
            <p className="sp-eyebrow mt-4">
              {tCommon("inspiredBy", { name: scent.inspiredBy })}
            </p>
            <p className="mt-5 max-w-md font-sans text-base text-muted">
              {scent.hasStory ? t("notesIntro") : t("notesIntroLabel")}
            </p>
          </div>
          <div className="mx-auto max-w-6xl">
            {scent.hasStory ? (
              <NotesPyramid scentKey={key} />
            ) : (
              /* No pyramid written yet — state the two notes the label
                 actually prints, and nothing more. */
              <ul className="grid gap-5 sm:grid-cols-2">
                {scent.noteWords.map((note, i) => (
                  <li
                    key={note}
                    className="overflow-hidden rounded-card border-2 border-ink bg-paper shadow-hard-sm"
                  >
                    <StripeBand color={scent.stripe} height={12} />
                    <div className="p-8">
                      <p className="sp-eyebrow mb-3">
                        {String(i + 1).padStart(2, "0")} — {t("noteOnLabel")}
                      </p>
                      <p className="sp-display text-d-xl lowercase">{note}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* How to wear */}
        <section className="relative overflow-hidden bg-paper-2 px-gutter py-section">
          <StripeBand
            color={scent.stripe}
            height={14}
            className="absolute inset-x-0 top-0"
          />
          <StripeBand
            color={scent.stripe}
            height={14}
            className="absolute inset-x-0 bottom-0"
          />
          <div className="mx-auto max-w-3xl text-center">
            <p className="sp-eyebrow">{t("wear")}</p>
            <p className="sp-display mx-auto mt-5 max-w-2xl text-d-xl">
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
