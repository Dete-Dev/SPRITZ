import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import SiteFooter from "@/components/SiteFooter";
import StorySection from "@/components/StorySection";
import CraftSection from "@/components/CraftSection";
import { Mark } from "@/components/ui/vandal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

/** Brief §16 — a destination for the About menu's "about" link. */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("aboutPage");

  return (
    <>
      <main className="min-h-screen bg-paper">
        <section className="px-gutter pt-28 md:pt-32">
          <div className="mx-auto max-w-6xl">
            <p className="sp-eyebrow">{t("eyebrow")}</p>
            <h1 className="sp-display mt-5 text-d-2xl">
              {t("headline")} <Mark color="var(--sp-blue)">{t("headlineEm")}</Mark>
            </h1>
          </div>
        </section>
        <div className="mt-12">
          <StorySection />
          <CraftSection />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
