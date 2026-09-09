import { getTranslations, setRequestLocale } from "next-intl/server";
import VideoHero from "@/components/VideoHero";
import InspiredByTicker from "@/components/InspiredByTicker";
import ScentRail from "@/components/ScentRail";
import GenderTiles from "@/components/GenderTiles";
import UspMarquee from "@/components/UspMarquee";
import SplitPromo from "@/components/SplitPromo";
import BlogBanner from "@/components/BlogBanner";
import SocialProof from "@/components/SocialProof";
import FaqSection from "@/components/FaqSection";
import SiteFooter from "@/components/SiteFooter";

/**
 * Homepage — the section order comes straight from the redesign brief:
 *
 *   §1 hero + centred SHOP ALL      §5 USP marquee
 *   §2 "inspired by" band           §6 50/50 split promo
 *   §3 best sellers rail            §7 featured rail
 *   §4 women / men / unisex         §8 journal banner
 *                                   §9 social proof + FAQ + footer
 *
 * Brief §1's sticky search bar and 20% badge are mounted in the locale
 * layout, so they follow the visitor onto every other page too.
 */

/** §3 — the shelf openers. Kept apart from the featured set below. */
const BEST_SELLERS = [
  "safran-ambre",
  "truffe-chocolat",
  "cerise-rose",
  "oud-santal",
  "mer-bergamote",
  "vanille-cafe",
] as const;

/** §7 — a different selection, as the brief requires. */
const FEATURED = [
  "cuir-tabac",
  "lavande-vanille",
  "citron-cardamome",
  "gardenia-mandarin",
  "poivre-ambre",
  "amande-tonka",
] as const;

const BEST_SELLER_BADGES: Record<string, string> = {
  "safran-ambre": "bestseller",
  "truffe-chocolat": "new",
};

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const best = await getTranslations("bestSellers");
  const feat = await getTranslations("featured");

  return (
    <main id="top">
      {/* §1 */}
      <VideoHero />

      {/* §2 */}
      <InspiredByTicker leadWord={t("common.tickerLead")} />

      {/* §3 */}
      <ScentRail
        id="best-sellers"
        scentKeys={BEST_SELLERS}
        title={best("headline")}
        titleMark={best("headlineEm")}
        markColor="var(--sp-yellow)"
        badges={BEST_SELLER_BADGES}
        pan
      />

      {/* §4 */}
      <GenderTiles />

      {/* §5 */}
      <UspMarquee />

      {/* §6 */}
      <SplitPromo />

      {/* §7 */}
      <ScentRail
        id="featured"
        scentKeys={FEATURED}
        title={feat("headline")}
        titleMark={feat("headlineEm")}
        markColor="var(--sp-pink)"
        surface="paper-2"
        stagger
        tilt
      />

      {/* §8 */}
      <BlogBanner />

      {/* §9 */}
      <SocialProof />
      <div id="faq">
        <FaqSection limit={3} />
      </div>
      <SiteFooter />
    </main>
  );
}
