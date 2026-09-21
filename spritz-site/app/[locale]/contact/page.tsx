import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import SiteFooter from "@/components/SiteFooter";
import Cta from "@/components/ui/Cta";
import { Mark, Spray } from "@/components/ui/vandal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

/** Brief §16 — a destination for the About menu's "contact" link. */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contactPage");

  return (
    <>
      <main className="min-h-screen bg-paper">
        <section className="relative overflow-hidden px-gutter pb-section pt-28 md:pt-32">
          <Spray color="var(--sp-pink)" opacity={0.28} className="absolute -right-20 -top-10 h-[26rem] w-[26rem]" />
          <div className="relative mx-auto max-w-3xl">
            <p className="sp-eyebrow">{t("eyebrow")}</p>
            <h1 className="sp-display mt-5 text-d-2xl">
              {t("headline")} <Mark color="var(--sp-pink)">{t("headlineEm")}</Mark>
            </h1>
            <p className="mt-6 max-w-lg font-sans text-d-lg text-ink">{t("body")}</p>
            <dl className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <dt className="sp-eyebrow">{t("emailLabel")}</dt>
                <dd className="mt-2">
                  <a href={`mailto:${t("email")}`} className="font-sans text-lg font-bold underline decoration-dotted underline-offset-4 hover:text-red">
                    {t("email")}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sp-eyebrow">{t("hoursLabel")}</dt>
                <dd className="mt-2 font-sans text-base text-muted">{t("hours")}</dd>
              </div>
            </dl>
            <p className="mt-10 font-sans text-sm text-muted">{t("shipping")}</p>
            <div className="mt-8">
              <Cta href="/faq" variant="ghost">{t("ctaFaq")}</Cta>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
