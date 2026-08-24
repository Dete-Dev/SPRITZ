"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { Sticker, StripeBand } from "@/components/ui/vandal";
import type { ResolvedDuoSet } from "@/lib/sets";

/**
 * A curated set — catalog spec products 23-33, and §15's "what is included"
 * readout: both bottles are named on the card with their size, not hidden
 * behind a box shot.
 *
 * The set is one SKU, so this adds straight to the cart. Its price already
 * carries the discount (lib/sizes), which is why nothing here touches the
 * cart-wide tiers.
 */
export default function PresetSetCard({ set }: { set: ResolvedDuoSet }) {
  const t = useTranslations("sets");
  const tCommon = useTranslations("common");
  const tCart = useTranslations("cart");

  const stripe = set.anchor.stripe;
  const bottles = [
    { scent: set.anchor, size: set.anchor.size },
    { scent: set.companion, size: "15ml" },
  ];

  return (
    <article className="sp-lift flex h-full w-full flex-col overflow-hidden rounded-card border-2 border-ink bg-paper text-left shadow-hard-sm">
      <div className="relative flex items-end justify-center gap-1.5 bg-paper-2 px-4 pt-6">
        {bottles.map(({ scent }, i) => (
          <span
            key={scent.key}
            /* The companion is the 15ml — draw it smaller so the card shows
               the size difference before you read the list. */
            className={i === 0 ? "relative block w-1/3 max-w-[5rem]" : "relative block w-1/4 max-w-[3.4rem]"}
            style={{ aspectRatio: "1 / 1.6" }}
          >
            <Image
              src={scent.clean}
              alt=""
              fill
              sizes="80px"
              className="object-contain"
            />
          </span>
        ))}
        {set.percentOff > 0 ? (
          <span className="absolute right-3 top-3">
            <Sticker tilt={4} variant="fill" fill="var(--sp-yellow)">
              −{set.percentOff}%
            </Sticker>
          </span>
        ) : null}
      </div>

      <StripeBand color={stripe} height={10} />

      <div className="flex flex-1 flex-col p-5">
        <p className="sp-display text-[1.35rem] leading-tight">
          {t(`presets.${set.key}`)}
        </p>

        {/* Spec §15 — a set says exactly what you receive, size included. */}
        <ul className="mt-3 space-y-1">
          {bottles.map(({ scent, size }) => (
            <li
              key={scent.key}
              className="flex items-center gap-2 font-sans text-[13px] text-muted"
            >
              <span
                aria-hidden
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: scent.stripe }}
              />
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
