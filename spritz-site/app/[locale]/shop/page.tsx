import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ShopGrid from "@/components/shop/ShopGrid";
import ShopSubmenu from "@/components/shop/ShopSubmenu";
import BundlePromoCard from "@/components/shop/BundlePromoCard";
import TierBanner from "@/components/scent/TierBanner";
import SiteFooter from "@/components/SiteFooter";
import { Mark, Sticker, Spray } from "@/components/ui/vandal";

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

/**
 * The shop — brief §11.
 *
 *   TierBanner   — the thin fixed promo bar
 *   ShopSubmenu  — the horizontal category row
 *   ShopGrid     — search + sort on the left, quick filters on the right,
 *                  the catalogue below with a set promo tile dealt in
 *
 * Paper world throughout. Bundling lives on its own page at /bundle.
 */
export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("shop");
  const tCommon = await getTranslations("common");

  return (
    <>
      {/* Brief §11 — the thin promo bar, fixed at the top of the shop. */}
      <TierBanner />

      <main className="min-h-screen bg-paper">
        <section className="relative overflow-hidden px-gutter pb-section pt-28 md:pt-32">
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

            {/* useSearchParams in both needs the boundary. */}
            <Suspense>
              <div className="mt-12">
                <ShopSubmenu />
              </div>
              {/* The promo tile is rendered on the server and dealt into the
                  client grid as a prop. */}
              <ShopGrid promoCard={<BundlePromoCard />} />
            </Suspense>
          </div>
        </section>

      </main>

      <SiteFooter />
    </>
  );
}
