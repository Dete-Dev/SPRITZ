import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import SiteFooter from "@/components/SiteFooter";
import Cta from "@/components/ui/Cta";
import { Mark, Spray, Sticker } from "@/components/ui/vandal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "journal" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

/**
 * The journal — brief §8's destination.
 *
 * The posts and their ambient photography do not exist yet, so this is the
 * holding page: it keeps the homepage banner's "Read more" honest instead of
 * pointing at a 404, and gives the first article somewhere to land.
 */
export default async function JournalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("journal");

  return (
    <>
      <main className="min-h-screen bg-paper">
        <section className="relative overflow-hidden px-gutter pb-section pt-36 md:pt-44">
          <Spray
            color="var(--sp-blue)"
            opacity={0.28}
            className="absolute -right-20 -top-10 h-[26rem] w-[26rem]"
          />

          <div className="relative mx-auto max-w-3xl">
            <p className="sp-eyebrow">{t("eyebrow")}</p>
            <h1 className="sp-display mt-5 text-d-2xl">
              {t("headline")}{" "}
              <Mark color="var(--sp-blue)">{t("headlineEm")}</Mark>
            </h1>
            {/* Two short blocks rather than one slab — the page is mostly
                copy, so the lead carries the point and the rest follows. */}
            <p className="mt-6 max-w-lg font-sans text-d-lg text-ink">
              {t("body")}
            </p>
            <p className="mt-4 max-w-md font-sans text-base text-muted">
              {t("bodyTwo")}
            </p>

            <div className="mt-8">
              <Sticker tilt={-4} variant="ink" fill="var(--sp-blue)">
                {t("badge")}
              </Sticker>
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              <Cta href="/shop" variant="primary">
                {t("ctaShop")}
              </Cta>
              <Cta href="/bundle" variant="ghost">
                {t("ctaBundle")}
              </Cta>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
