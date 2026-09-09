import { getTranslations } from "next-intl/server";
import { BUNDLE_TIERS } from "@/lib/bundle";

/**
 * The subtle black bundle band — brief §13. Sits at the very top of the
 * product page and stays there through the scroll, so the progressive
 * discount is never off screen while someone is deciding.
 *
 * Reads BUNDLE_TIERS rather than hardcoding the percentages, so the band and
 * the bundle builder can never disagree (lib/bundle.ts is the UI source of
 * truth; the Shopify Function is the authority at checkout).
 */
export default async function TierBanner() {
  const t = await getTranslations("tierBanner");

  return (
    <div className="sticky top-0 z-30 border-b-2 border-ink bg-ink">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-gutter py-2 text-cream">
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-cream/60">
          {t("label")}
        </span>
        {BUNDLE_TIERS.map((tier) => (
          <span
            key={tier.minQuantity}
            className="font-sans text-[11px] font-bold uppercase tracking-[0.12em]"
          >
            {t("tier", { count: tier.minQuantity, percent: tier.percentOff })}
          </span>
        ))}
      </div>
    </div>
  );
}
