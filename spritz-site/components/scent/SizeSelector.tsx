"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useBundle } from "@/components/bundle/BundleProvider";
import AddToCartButton from "@/components/cart/AddToCartButton";
import Cta from "@/components/ui/Cta";
import { BUNDLE_TIERS } from "@/lib/bundle";
import type { Scent } from "@/lib/scents";

/**
 * Pack selector — brief §13's pill-type size selector.
 *
 * The brief's reference offers "50ML + 15ML" and "50ML". SPRITZ has one size
 * and no 15ml SKU, so the two options are the two real ways to buy: a single
 * bottle, or the duo — two bottles at the first bundle tier. Choosing the duo
 * drops this scent into the shared bundle and hands over to the builder to
 * pick the second, rather than inventing a set product that does not exist.
 *
 * Radio-card treatment matches PurchaseOptions' PlanRow so the two selectors
 * on this page read as one control family.
 */
type Pack = "single" | "duo";

/** The first tier is the duo (2 bottles); fall back if tiers are re-cut. */
const DUO_TIER = BUNDLE_TIERS[0];

export default function SizeSelector({ scent }: { scent: Scent }) {
  const t = useTranslations("packSelector");
  const tCart = useTranslations("cart");
  const { addScent } = useBundle();
  const router = useRouter();

  const [pack, setPack] = useState<Pack>("single");

  const duoQty = DUO_TIER?.minQuantity ?? 2;
  const duoPercent = DUO_TIER?.percentOff ?? 0;
  const duoFull = scent.price * duoQty;
  const duoTotal = duoFull - Math.round((duoFull * duoPercent) / 100);

  function startDuo() {
    addScent(scent.key);
    router.push("/bundle");
  }

  return (
    <div className="max-w-md">
      <fieldset>
        <legend className="sp-eyebrow mb-3">{t("legend")}</legend>

        <PackRow
          checked={pack === "single"}
          onSelect={() => setPack("single")}
          title={t("singleTitle", { size: scent.size })}
          price={t("price", { price: scent.price })}
        />
        <PackRow
          checked={pack === "duo"}
          onSelect={() => setPack("duo")}
          title={t("duoTitle", { count: duoQty, size: scent.size })}
          price={t("price", { price: duoTotal })}
          was={t("price", { price: duoFull })}
          flag={t("duoFlag", { percent: duoPercent })}
        />
      </fieldset>

      <div className="mt-5">
        {pack === "single" ? (
          <AddToCartButton
            variantId={scent.shopifyVariantId}
            label={tCart("addToBag")}
            addedLabel={tCart("added")}
            notReadyLabel={tCart("notReady")}
          />
        ) : (
          <Cta onClick={startDuo} variant="primary" block>
            {t("duoCta")}
          </Cta>
        )}
      </div>

      {/* Brief §15 — what the set actually contains, stated before you commit. */}
      {pack === "duo" ? (
        <div className="mt-4 rounded-card border-2 border-ink bg-paper-2 px-5 py-4">
          <p className="sp-eyebrow mb-3">{t("includedTitle")}</p>
          <ul className="space-y-2 font-sans text-[13px] text-muted">
            <li className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: scent.stripe }}
              />
              <span className="text-ink">{t("includedThis", { name: scent.name })}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-dashed border-ink/40"
              />
              <span>{t("includedNext")}</span>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function PackRow({
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
        name="pack-option"
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
