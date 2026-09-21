import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { DUO_SETS, resolveSet } from "@/lib/sets";
import AddToCartButton from "@/components/cart/AddToCartButton";
import SetBottles from "@/components/sets/SetBottles";
import SetIncluded from "@/components/sets/SetIncluded";
import TierBanner from "@/components/scent/TierBanner";
import SiteFooter from "@/components/SiteFooter";
import Accordion, { type AccordionItem } from "@/components/ui/Accordion";
import { Spray, Sticker, StripeBand } from "@/components/ui/vandal";

/**
 * Product page for a preset (curated) set — brief §15.2: bottles on the
 * left; on the right the title, price, Add to cart, and a "What is included"
 * accordion open by default that shows each bottle with a thumbnail and
 * what it is inspired by.
 */
const SET_FAQ_KEYS = ["size", "bundle", "returns"] as const;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    DUO_SETS.map((set) => ({ locale, key: set.key })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; key: string }>;
}): Promise<Metadata> {
  const { locale, key } = await params;
  const t = await getTranslations({ locale, namespace: "sets" });
  return { title: `SPRITZ — ${t(`presets.${key}`)}` };
}

export default async function SetPage({
  params,
}: {
  params: Promise<{ locale: string; key: string }>;
}) {
  const { locale, key } = await params;
  setRequestLocale(locale);

  const base = DUO_SETS.find((s) => s.key === key);
  const set = base ? resolveSet(base) : null;
  if (!set) notFound();

  const t = await getTranslations("setPage");
  const tSets = await getTranslations("sets");
  const tCommon = await getTranslations("common");
  const tCart = await getTranslations("cart");
  const tFaq = await getTranslations("faq");
  const tScent = await getTranslations("scentPage");

  const items: AccordionItem[] = [
    {
      id: "included",
      title: t("included"),
      defaultOpen: true,
      body: <SetIncluded set={set} />,
    },
    {
      id: "shipping",
      title: tScent("accordion.shipping"),
      hint: tScent("shippingHint"),
      body: (
        <div className="space-y-4 font-sans text-base text-muted">
          <p>{tFaq("items.shipping.a")}</p>
          <p>{tFaq("items.returns.a")}</p>
        </div>
      ),
    },
    {
      id: "faqs",
      title: tScent("accordion.faqs"),
      body: (
        <dl className="space-y-5">
          {SET_FAQ_KEYS.map((q) => (
            <div key={q}>
              <dt className="font-sans text-sm font-bold uppercase tracking-[0.06em]">
                {tFaq(`items.${q}.q`)}
              </dt>
              <dd className="mt-2 font-sans text-base text-muted">{tFaq(`items.${q}.a`)}</dd>
            </div>
          ))}
        </dl>
      ),
    },
  ];

  return (
    <>
      <TierBanner />
      <main className="relative min-h-screen overflow-hidden bg-paper">
        <StripeBand color={set.anchor.stripe} height={14} />

        <div className="mx-auto max-w-7xl px-gutter pt-24 md:pt-28">
          <Link href="/sets" className="sp-eyebrow hover:text-ink">
            {t("back")}
          </Link>
        </div>

        <section className="relative mx-auto max-w-7xl px-gutter py-10 md:py-16">
          <Spray
            color={set.anchor.stripe}
            opacity={0.25}
            className="absolute -left-20 top-0 h-[30rem] w-[30rem]"
          />
          <div className="relative grid grid-cols-12 items-start gap-8 md:gap-14">
            <div className="col-span-12 overflow-hidden rounded-card border-2 border-ink shadow-hard md:sticky md:top-28 md:col-span-7 md:self-start">
              <SetBottles set={set} size="hero" />
              <StripeBand color={set.anchor.stripe} height={12} />
            </div>

            <div className="col-span-12 md:col-span-5">
              <p className="sp-eyebrow">{t("eyebrow")}</p>
              <h1 className="sp-display mt-3 text-[clamp(2.2rem,4vw,4rem)]">
                {tSets(`presets.${set.key}`)}
              </h1>
              <p className="mt-3 font-sans text-sm text-muted">
                {t("contents", { anchor: set.anchor.name, companion: set.companion.name })}
              </p>

              <div className="mt-6">
                <Sticker tilt={-4} variant="fill" fill="var(--sp-yellow)">
                  −{set.percentOff}%
                </Sticker>
              </div>

              <div className="mb-6 mt-6 border-t-2 border-ink pt-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-sans text-3xl font-bold">
                    {tCommon("price", { price: set.total })}
                  </span>
                  <span className="sp-strike font-sans text-base text-muted">
                    {tCommon("price", { price: set.subtotal })}
                  </span>
                </div>
              </div>

              <div className="max-w-md">
                <AddToCartButton
                  variantId={set.shopifyVariantId ?? ""}
                  label={tCart("addToBag")}
                  addedLabel={tCart("added")}
                  notReadyLabel={tCart("notReady")}
                />
              </div>

              <Accordion items={items} className="mt-8" />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
