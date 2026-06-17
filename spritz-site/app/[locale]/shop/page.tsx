import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BundleBuilder from "@/components/bundle/BundleBuilder";

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
 * Shop page — the slot-style bundle builder. BundleBuilder is self-contained
 * (its own card + heading), so the page is just a centered shell. Same
 * component renders under the hero on the home page.
 */
export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("bundle");

  return (
    <main className="min-h-screen px-6 pb-32 pt-36 md:pt-44">
      <p className="mx-auto mb-8 max-w-3xl text-[11px] uppercase tracking-[0.45em] text-ink/55">
        {t("eyebrow")}
      </p>
      <div className="mx-auto max-w-3xl">
        <BundleBuilder />
      </div>
    </main>
  );
}
