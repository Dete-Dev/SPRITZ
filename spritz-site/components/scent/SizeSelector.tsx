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
 * Size selector — catalog spec §1, brief §13: two pill buttons, the set
 * first ("50ML + 15ML · €126") then the standard bottle ("50ML · €100"),
 * each carrying its price.
 *
 * Both are their own Shopify SKU, so both add straight to the cart; neither
 * routes through the bundle builder. The Travel Set price already contains
 * its discount (see lib/sizes) — it does not stack with the cart-wide tiers.
 */
export default function SizeSelector({ scent }: { scent: Scent }) {
  const t = useTranslations("packSelector");
  const tCart = useTranslations("cart");

  const [size, setSize] = useState<SizeKey>("travel");

  const travelFull = travelSetSubtotal(scent.price);
  const travelTotal = travelSetPrice(scent.price);
  const travel = size === "travel";

  const options: { key: SizeKey; label: string; price: string }[] = [
    { key: "travel", label: t("setLabel", { size: scent.size }), price: t("price", { price: travelTotal }) },
    { key: "50ml", label: scent.size, price: t("price", { price: scent.price }) },
  ];

  return (
    <div className="max-w-md">
      <p className="sp-eyebrow mb-3">{t("legend")}</p>
      <div role="radiogroup" aria-label={t("legend")} className="flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = size === o.key;
          return (
            <button
              key={o.key}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => setSize(o.key)}
              className={`inline-flex items-baseline gap-2 rounded-full border-2 px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-150 ease-spritz ${
                checked
                  ? "border-ink bg-ink text-paper shadow-hard-sm"
                  : "border-line bg-paper text-ink hover:border-ink"
              }`}
            >
              <span>{o.label}</span>
              <span className={checked ? "text-paper/80" : "text-muted"}>{o.price}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-red">
        {t("travelFlag", { percent: TRAVEL_SET_PERCENT_OFF })}{" "}
        <span className="sp-strike font-normal text-muted">
          {t("price", { price: travelFull })}
        </span>
      </p>

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
              <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: scent.stripe }} />
              <span className="text-ink">{t("includedBottle", { name: scent.name, size: scent.size })}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span aria-hidden className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: scent.stripe }} />
              <span className="text-ink">{t("includedCompanion", { name: scent.name })}</span>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
