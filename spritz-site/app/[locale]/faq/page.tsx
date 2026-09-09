import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import SiteFooter from "@/components/SiteFooter";
import FaqSection from "@/components/FaqSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faqPage" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

/** Brief §16 — a destination for the About menu's "faq" link. */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faqPage");

  return (
    <>
      <main className="min-h-screen bg-paper">
        <section className="px-gutter pt-28 md:pt-32">
          <div className="mx-auto max-w-3xl">
            <p className="sp-eyebrow">{t("eyebrow")}</p>
          </div>
        </section>
        <div id="shipping" className="scroll-mt-28 pb-section">
          <FaqSection />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
