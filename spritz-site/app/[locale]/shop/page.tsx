import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BundleBuilder from "@/components/bundle/BundleBuilder";
import ScentCard from "@/components/ui/ScentCard";
import SiteFooter from "@/components/SiteFooter";
import { Mark, Sticker, Spray } from "@/components/ui/vandal";
import { SCENTS } from "@/lib/scents";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("shopTitle"),
    description: t("shopDescription"),
  };
}

/** Copy stickers, keyed by scent — same two as the home grid. */
const BADGES: Record<string, string> = {
  "safran-ambre": "bestseller",
  "truffe-chocolat": "new",
};

/**
 * The shop. Paper world throughout: the full five as cards, then the bundle
 * builder as the closing ask. Filtering lives on the home page's finder, so
 * this page stays a plain shelf — five products don't need facets.
 */
export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("shop");
  const tFive = await getTranslations("five");
  const tCommon = await getTranslations("common");

  return (
    <>
      <main className="min-h-screen bg-paper">
        <section className="relative overflow-hidden px-gutter pb-section pt-36 md:pt-44">
          <Spray
            color="var(--sp-red)"
            opacity={0.28}
            className="absolute -left-24 -top-10 h-[26rem] w-[26rem]"
          />

          <div className="relative mx-auto max-w-6xl">
            <p className="sp-eyebrow">{t("eyebrow")}</p>
            <h1 className="sp-display mt-5 text-d-2xl">
              <Mark color="var(--sp-red)">{t("headline")}</Mark>
            </h1>
            <div className="mt-6">
              <Sticker tilt={-4} variant="ink" fill="var(--sp-red)">
                {tCommon("allUnder")}
              </Sticker>
            </div>

            <ul className="mt-14 grid grid-cols-2 items-stretch gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {SCENTS.map((scent, idx) => (
                <li key={scent.key}>
                  <ScentCard
                    scent={scent}
                    priceLabel={tCommon("price", { price: scent.price })}
                    inspiredByLabel={tCommon("inspiredBy", { name: scent.inspiredBy })}
                    note={tFive(`shortNotes.${scent.key}`)}
                    badge={BADGES[scent.key]}
                    priority={idx < 3}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="bundle" className="px-gutter pb-section">
          <div className="mx-auto max-w-5xl">
            <BundleBuilder />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
