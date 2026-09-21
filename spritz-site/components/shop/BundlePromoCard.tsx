import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Sticker } from "@/components/ui/vandal";
import { BUNDLE_TIERS } from "@/lib/bundle";

/**
 * The interleaved promo card — brief §11. Sits among the products in the
 * grid, double height and in a different language to the product cards, and
 * sends people to the set builder.
 *
 * Ink surface rather than a photo: the design system forbids gradients behind
 * bottles, and this tile carries no bottle at all.
 */
export default async function BundlePromoCard() {
  const t = await getTranslations("shopPromo");
  const top = BUNDLE_TIERS[BUNDLE_TIERS.length - 1];

  return (
    <Link
      href="/bundle"
      className="sp-lift sp-surface-ink sp-grain group relative flex h-full flex-col justify-between overflow-hidden rounded-card border-2 border-ink p-6 shadow-hard"
    >
      <div>
        <p className="sp-eyebrow !text-cream/70">{t("eyebrow")}</p>
        <p className="sp-display mt-4 text-[clamp(1.6rem,2.4vw,2.4rem)] leading-[1.05] text-cream">
          {t("title")}
        </p>
      </div>

      <div className="mt-8">
        <Sticker tilt={-4} variant="fill" fill="var(--sp-yellow)">
          {t("badge", { percent: top?.percentOff ?? 20 })}
        </Sticker>
        <p className="mt-5 inline-flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-cream">
          {t("cta")}
          <span
            aria-hidden
            className="transition-transform duration-200 ease-spritz group-hover:translate-x-1"
          >
            →
          </span>
        </p>
      </div>
    </Link>
  );
}
