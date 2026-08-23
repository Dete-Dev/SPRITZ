import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SCENTS, SCENT_KEYS } from "@/lib/scents";
import ScentGallery from "@/components/scent/ScentGallery";
import BuyBox from "@/components/scent/BuyBox";
import TierBanner from "@/components/scent/TierBanner";
import ScentNotes from "@/components/scent/ScentNotes";
import MoreFromTheFive from "@/components/scent/MoreFromTheFive";
import SiteFooter from "@/components/SiteFooter";
import Accordion, { type AccordionItem } from "@/components/ui/Accordion";
import ScentCard from "@/components/ui/ScentCard";
import { Spray, StripeBand } from "@/components/ui/vandal";

/**
 * Product page for a single scent — brief §13, §14, §15.
 *
 *   TierBanner   — the sticky black bundle band, always on screen
 *   Above-fold   — ScentGallery (left) | BuyBox (right, sticky on md+)
 *   Accordions   — Scent Notes / About / Shipping + Returns / FAQs /
 *                  Best Layered With, in the brief's order
 *   MoreFromTheFive, SiteFooter
 *
 * Pre-renders one route per (locale × scent) at build time.
 */

/** Brief §14 asks for three impactful questions, not the whole FAQ. */
const PDP_FAQ_KEYS = ["dupe", "lasting", "bundle"] as const;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SCENT_KEYS.map((key) => ({ locale, key })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; key: string }>;
}): Promise<Metadata> {
  const { locale, key } = await params;
  const scent = SCENTS.find((s) => s.key === key);
  if (!scent) return { title: "SPRITZ" };
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    title: `SPRITZ — ${scent.name}`,
    description: `${scent.name} — ${t("inspiredBy", { name: scent.inspiredBy })}. 50ml eau de parfum, €${scent.price}.`,
  };
}

export default async function ScentPage({
  params,
}: {
  params: Promise<{ locale: string; key: string }>;
}) {
  const { locale, key } = await params;
  setRequestLocale(locale);
  const scent = SCENTS.find((s) => s.key === key);
  if (!scent) notFound();

  const t = await getTranslations("scentPage");
  const tCommon = await getTranslations("common");
  const tFive = await getTranslations("five");
  const tFaq = await getTranslations("faq");
  // Only the five with `hasStory` carry hand-written editorial. The rest read
  // from label facts alone rather than inventing copy.
  const tStory = scent.hasStory
    ? await getTranslations(`scentDetails.${key}`)
    : null;

  /* Brief §14 "Best layered with" — no pairing data exists, so this derives
     from the scent family: same family layers predictably. Real data, no
     invention. */
  const layerWith = SCENTS.filter(
    (s) => s.key !== scent.key && s.family === scent.family,
  ).slice(0, 3);

  const accordionItems: AccordionItem[] = [
    {
      id: "notes",
      title: t("accordion.notes"),
      defaultOpen: true,
      body: <ScentNotes scent={scent} />,
    },
    {
      id: "about",
      title: t("accordion.about"),
      body: (
        <div className="space-y-4 font-sans text-base text-muted">
          {tStory ? (
            <>
              <p className="text-ink">{tStory("story1")}</p>
              <p>{tStory("story2")}</p>
            </>
          ) : (
            <p>{t("aboutFallback")}</p>
          )}
          <p>{t("wearBody")}</p>
        </div>
      ),
    },
    {
      id: "shipping",
      title: t("accordion.shipping"),
      hint: t("shippingHint"),
      body: (
        <div className="space-y-4 font-sans text-base text-muted">
          <p>{tFaq("items.shipping.a")}</p>
          <p>{tFaq("items.returns.a")}</p>
        </div>
      ),
    },
    {
      id: "faqs",
      title: t("accordion.faqs"),
      body: (
        <dl className="space-y-5">
          {PDP_FAQ_KEYS.map((q) => (
            <div key={q}>
              <dt className="font-sans text-sm font-bold uppercase tracking-[0.06em]">
                {tFaq(`items.${q}.q`)}
              </dt>
              <dd className="mt-2 font-sans text-base text-muted">
                {tFaq(`items.${q}.a`)}
              </dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      id: "layered",
      title: t("accordion.layered"),
      body: (
        <>
          <p className="mb-5 font-sans text-base text-muted">
            {t("layeredIntro")}
          </p>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {layerWith.map((s) => (
              <li key={s.key}>
                <ScentCard
                  scent={s}
                  priceLabel={tCommon("price", { price: s.price })}
                  note={tFive(`shortNotes.${s.key}`)}
                />
              </li>
            ))}
          </ul>
        </>
      ),
    },
  ];

  return (
    <>
      {/* Brief §13 — the progressive-discount band, visible non-stop. */}
      <TierBanner />

      {/* Bottles sit on plain paper white — no gradient behind product
          (design system rule 5). The scent's identity is carried by its
          stripe colourway and one spray hit instead. */}
      <main className="relative min-h-screen overflow-hidden bg-paper">
        <StripeBand color={scent.stripe} height={14} />

        {/* Back link */}
        <div className="mx-auto max-w-7xl px-gutter pt-24 md:pt-28">
          <Link href="/shop" className="sp-eyebrow hover:text-ink">
            {t("back")}
          </Link>
        </div>

        {/* Above the fold: gallery + buy box */}
        <section className="relative mx-auto max-w-7xl px-gutter py-10 md:py-16">
          <Spray
            color={scent.stripe}
            opacity={0.25}
            className="absolute -left-20 top-0 h-[30rem] w-[30rem]"
          />
          <div className="relative grid grid-cols-12 items-start gap-8 md:gap-14">
            <div className="col-span-12 md:col-span-7">
              <ScentGallery
                images={scent.gallery}
                alt={scent.name}
                stripe={scent.stripe}
              />
            </div>
            <div className="col-span-12 md:col-span-5">
              <BuyBox scent={scent} />
            </div>
          </div>
        </section>

        {/* Brief §14 — everything else folded away to keep the page clean. */}
        <section className="mx-auto max-w-7xl px-gutter pb-section">
          <div className="md:max-w-3xl">
            <Accordion items={accordionItems} />
          </div>
        </section>

        <MoreFromTheFive excludeKey={key} />
      </main>

      <SiteFooter />
    </>
  );
}
