"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import AddToCartButton from "@/components/cart/AddToCartButton";
import type { Scent } from "@/lib/scents";
import {
  TRAVEL_SET_PERCENT_OFF,
  travelSetPrice,
  travelSetSubtotal,
  type SizeKey,
} from "@/lib/sizes";

/**
 * Size selector — catalog spec §1, products 1-22.
 *
 * Two real variants: the plain 50ml, or the Travel Set, which adds a 15ml of
 * the same scent. Both are their own Shopify SKU, so both add straight to the
 * cart; neither routes through the bundle builder. The Travel Set price
 * already contains its discount (see lib/sizes) — it does not stack with the
 * cart-wide tiers.
 *
 * Radio-card treatment matches PurchaseOptions' PlanRow so the two selectors
 * on this page read as one control family.
 */
export default function SizeSelector({ scent }: { scent: Scent }) {
  const t = useTranslations("packSelector");
  const tCart = useTranslations("cart");

  const [size, setSize] = useState<SizeKey>("50ml");

  const travelFull = travelSetSubtotal(scent.price);
  const travelTotal = travelSetPrice(scent.price);
  const travel = size === "travel";

  return (
    <div className="max-w-md">
      <fieldset>
        <legend className="sp-eyebrow mb-3">{t("legend")}</legend>

        <SizeRow
          checked={!travel}
          onSelect={() => setSize("50ml")}
          title={t("singleTitle", { size: scent.size })}
          price={t("price", { price: scent.price })}
        />
        <SizeRow
          checked={travel}
          onSelect={() => setSize("travel")}
          title={t("travelTitle", { size: scent.size })}
          price={t("price", { price: travelTotal })}
          was={t("price", { price: travelFull })}
          flag={t("travelFlag", { percent: TRAVEL_SET_PERCENT_OFF })}
        />
      </fieldset>

      <div className="mt-5">
        <AddToCartButton
          variantId={travel ? (scent.travelVariantId ?? "") : scent.shopifyVariantId}
          label={tCart("addToBag")}
          addedLabel={tCart("added")}
          notReadyLabel={tCart("notReady")}
        />
      </div>

      {/* Brief §15 — what the set actually contains, stated before you commit. */}
      {travel ? (
        <div className="mt-4 rounded-card border-2 border-ink bg-paper-2 px-5 py-4">
          <p className="sp-eyebrow mb-3">{t("includedTitle")}</p>
          <ul className="space-y-2 font-sans text-[13px] text-muted">
            <li className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: scent.stripe }}
              />
              <span className="text-ink">
                {t("includedBottle", { name: scent.name, size: scent.size })}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: scent.stripe }}
              />
              <span className="text-ink">
                {t("includedCompanion", { name: scent.name })}
              </span>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function SizeRow({
  checked,
  onSelect,
  title,
  price,
  was,
  flag,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  price: string;
  /** Struck-through full price, shown on the discounted option. */
  was?: string;
  flag?: string;
}) {
  return (
    <label
      className={`mb-3 flex cursor-pointer items-center gap-3 rounded-card border-2 px-5 py-4 transition-all duration-150 ease-spritz ${
        checked
          ? "border-ink bg-paper shadow-hard-sm"
          : "border-line bg-paper hover:border-ink"
      }`}
    >
      <input
        type="radio"
        name="size-option"
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        aria-hidden
        className={`inline-block h-3.5 w-3.5 shrink-0 rounded-full border-2 border-ink transition-colors ${
          checked ? "bg-red" : "bg-paper"
        }`}
      />
      <span className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="font-sans text-[11px] font-bold uppercase tracking-[0.12em]">
          {title}
        </span>
        <span className="flex items-baseline gap-2">
          {was ? (
            <span className="sp-strike font-sans text-[13px] text-muted">
              {was}
            </span>
          ) : null}
          <span className="font-sans text-[15px] font-bold">{price}</span>
        </span>
        {flag ? (
          <span className="w-full font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-red">
            {flag}
          </span>
        ) : null}
      </span>
    </label>
  );
}
