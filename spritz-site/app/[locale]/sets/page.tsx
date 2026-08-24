import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CustomSetCard from "@/components/sets/CustomSetCard";
import PresetSetCard from "@/components/sets/PresetSetCard";
import TierBanner from "@/components/scent/TierBanner";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { Mark, Spray } from "@/components/ui/vandal";
import { resolvedSets } from "@/lib/sets";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("setsTitle"),
    description: t("setsDescription"),
  };
}

/**
 * Gift sets — brief §12.
 *
 * Visual hierarchy is the whole point of this page: the two customisable
 * offers are the biggest thing on it, and the ready-made selections sit in a
 * grid immediately underneath.
 *
 * Everything here is the ordinary bundle in different clothes — same bottles,
 * same tier maths — so no set can ever be priced differently from building it
 * by hand.
 */
export default async function SetsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sets");

  const presets = resolvedSets();

  return (
    <>
      <TierBanner />

      <main className="min-h-screen bg-paper">
        <section className="relative overflow-hidden px-gutter pt-28 md:pt-32">
          <Spray
            color="var(--sp-yellow)"
            opacity={0.3}
            className="absolute -left-24 -top-8 h-[26rem] w-[26rem]"
          />

          <div className="relative mx-auto max-w-6xl">
            <p className="sp-eyebrow">{t("eyebrow")}</p>
            <h1 className="sp-display mt-5 text-d-2xl">
              {t("headline")} <Mark color="var(--sp-yellow)">{t("headlineEm")}</Mark>
            </h1>
            <p className="mt-6 max-w-xl font-sans text-d-lg text-muted">
              {t("intro")}
            </p>

            {/* The two custom offers — deliberately the largest tiles here. */}
            <div className="mt-14 grid gap-6 md:grid-cols-2 md:gap-8">
              <Reveal>
                <div id="duo" className="scroll-mt-32">
                <CustomSetCard
                  shapeKey="duo"
                  stripe="var(--sp-blue)"
                  previewKeys={["mer-bergamote", "cedre-menthe"]}
                />
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div id="trio" className="scroll-mt-32">
                <CustomSetCard
                  shapeKey="trio"
                  stripe="var(--sp-pink)"
                  previewKeys={["cerise-rose", "safran-ambre", "truffe-chocolat"]}
                />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Ready-made selections. */}
        <section className="px-gutter pb-section pt-section">
          <div className="mx-auto max-w-6xl">
            <p className="sp-eyebrow">{t("presetEyebrow")}</p>
            <h2 className="sp-display mt-4 text-d-xl">{t("presetTitle")}</h2>
            <p className="mt-4 max-w-lg font-sans text-base text-muted">
              {t("presetBody")}
            </p>

            <ul className="mt-10 grid grid-cols-2 items-stretch gap-5 lg:grid-cols-3">
              {presets.map((set, idx) => (
                <Reveal key={set.key} delay={idx * 70} as="li" className="flex">
                  <PresetSetCard set={set} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
