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
  const t = await getTranslations({ locale, namespace: "referPage" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

/** Brief §16 — a destination for the About menu's "refer" link. */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("referPage");

  return (
    <>
      <main className="min-h-screen bg-paper">
        <section className="relative overflow-hidden px-gutter pb-section pt-28 md:pt-32">
          <Spray color="var(--sp-yellow)" opacity={0.3} className="absolute -left-24 -top-8 h-[26rem] w-[26rem]" />
          <div className="relative mx-auto max-w-3xl">
            <p className="sp-eyebrow">{t("eyebrow")}</p>
            <h1 className="sp-display mt-5 text-d-2xl">
              {t("headline")} <Mark color="var(--sp-yellow)">{t("headlineEm")}</Mark>
            </h1>
            <p className="mt-6 max-w-lg font-sans text-d-lg text-ink">{t("body")}</p>
            <ol className="mt-10 grid gap-6 sm:grid-cols-3">
              {(t.raw("steps") as string[]).map((step, i) => (
                <li key={i} className="rounded-card border-2 border-ink bg-paper p-5 shadow-hard-sm">
                  <Sticker tilt={i % 2 === 0 ? -4 : 3} variant="fill" fill="var(--sp-yellow)">
                    0{i + 1}
                  </Sticker>
                  <p className="mt-4 font-sans text-sm text-ink">{step}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 font-sans text-sm text-muted">{t("footnote")}</p>
            <div className="mt-8">
              <Cta href="/shop" variant="primary">{t("cta")}</Cta>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
