import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BundleBuilder from "@/components/bundle/BundleBuilder";
import BundleIncluded from "@/components/bundle/BundleIncluded";
import SiteFooter from "@/components/SiteFooter";
import Cta from "@/components/ui/Cta";
import { Mark, Spray } from "@/components/ui/vandal";
import { SCENTS } from "@/lib/scents";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("bundleTitle"),
    description: t("bundleDescription"),
  };
}

/**
 * The bundle builder as its own destination. Same shape as the shop page:
 * this server component owns the heading furniture, <BundleBuilder/> owns
 * the interactive tool (slots, filtered picker, tier maths).
 */
export default async function BundlePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("bundle");
  const tFive = await getTranslations("five");

  return (
    <>
      <main className="min-h-screen bg-paper">
        <section className="relative overflow-hidden px-gutter pb-section pt-36 md:pt-44">
          <Spray
            color="var(--sp-yellow)"
            opacity={0.32}
            className="absolute -left-20 -top-8 h-[26rem] w-[26rem]"
          />

          <div className="relative mx-auto max-w-5xl">
            <p className="sp-eyebrow">{t("eyebrow")}</p>
            <h1 className="sp-display mt-5 text-d-2xl">
              <Mark color="var(--sp-yellow)">{t("headline")}</Mark>
            </h1>
            <p className="mt-6 max-w-xl font-sans text-d-lg text-muted">
              {t("intro")}
            </p>

            <div className="mt-12">
              <BundleBuilder />
            </div>

            {/* Brief §15 — what the set actually contains, spelled out. */}
            <div className="mt-10">
              <BundleIncluded />
            </div>

            <div className="mt-14 flex justify-center">
              <Cta href="/shop" variant="ghost">
                {tFive("seeAll", { count: SCENTS.length })}
              </Cta>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
