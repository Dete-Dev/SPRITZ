"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import AddToCartButton from "@/components/cart/AddToCartButton";
import SetBottles from "@/components/sets/SetBottles";
import { Sticker, StripeBand } from "@/components/ui/vandal";
import type { ResolvedDuoSet } from "@/lib/sets";

/**
 * A curated set — catalog spec products 23-33. Both bottles are named on the
 * card with their size; the full "what is included" readout lives on the
 * set's own page (/sets/<key>, brief §15.2).
 *
 * The set is one SKU, so this adds straight to the cart. Its price already
 * carries the discount (lib/sizes), which is why nothing here touches the
 * cart-wide tiers.
 */
export default function PresetSetCard({ set }: { set: ResolvedDuoSet }) {
  const t = useTranslations("sets");
  const tSet = useTranslations("setPage");
  const tCommon = useTranslations("common");
  const tCart = useTranslations("cart");

  const bottles = [
    { scent: set.anchor, size: set.anchor.size },
    { scent: set.companion, size: "15ml" },
  ];

  return (
    <article className="sp-lift flex h-full w-full flex-col overflow-hidden rounded-card border-2 border-ink bg-paper text-left shadow-hard-sm">
      <Link href={`/sets/${set.key}`} aria-label={t(`presets.${set.key}`)} className="relative block">
        <SetBottles set={set} />
        {set.percentOff > 0 ? (
          <span className="absolute right-3 top-3">
            <Sticker tilt={4} variant="fill" fill="var(--sp-yellow)">
              −{set.percentOff}%
            </Sticker>
          </span>
        ) : null}
      </Link>

      <StripeBand color={set.anchor.stripe} height={10} />

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/sets/${set.key}`} className="sp-display text-[1.35rem] leading-tight hover:text-red">
          {t(`presets.${set.key}`)}
        </Link>
        <Link
          href={`/sets/${set.key}`}
          className="mt-1 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-muted underline decoration-dotted underline-offset-2 hover:text-ink"
        >
          {tSet("details")}
        </Link>

        <ul className="mt-3 space-y-1">
          {bottles.map(({ scent, size }) => (
            <li key={scent.key} className="flex items-center gap-2 font-sans text-[13px] text-muted">
              <span aria-hidden className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: scent.stripe }} />
              <span className="truncate">{scent.name}</span>
              <span className="ml-auto shrink-0 font-bold text-ink">{size}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2">
            <span className="sp-strike font-sans text-sm text-muted">
              {tCommon("price", { price: set.subtotal })}
            </span>
            <span className="font-sans text-lg font-bold">
              {tCommon("price", { price: set.total })}
            </span>
          </div>
          <div className="mt-3">
            <AddToCartButton
              variantId={set.shopifyVariantId ?? ""}
              label={tCart("addToBag")}
              addedLabel={tCart("added")}
              notReadyLabel={tCart("notReady")}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
