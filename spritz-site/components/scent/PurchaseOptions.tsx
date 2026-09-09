"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  getSellingPlans,
  sellingPlanPercentOff,
} from "@/lib/shopify/products";
import type { SellingPlanAllocation } from "@/lib/shopify/types";
import { useCart } from "@/components/cart/CartProvider";
import AddToCartButton from "@/components/cart/AddToCartButton";

interface PurchaseOptionsProps {
  /** Shopify variant GID — empty until the store is wired up. */
  variantId: string;
  /** Base one-time price in EUR (from lib/scents). */
  price: number;
  className?: string;
}

/**
 * One-time vs subscription selector above the product CTA.
 *
 * Fetches selling plans for the variant at runtime, only when Shopify is
 * configured. Until a subscription app (e.g. Appstle) publishes plans, the
 * fetch returns an empty list and this renders exactly what BuyBox rendered
 * before — just the AddToCartButton. No layout shift, no Shopify coupling
 * in the server component.
 */
export default function PurchaseOptions({
  variantId,
  price,
  className,
}: PurchaseOptionsProps) {
  const t = useTranslations("purchaseOptions");
  const tCart = useTranslations("cart");
  const { isReady } = useCart();
  const [plans, setPlans] = useState<SellingPlanAllocation[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !variantId) return;
    let cancelled = false;
    (async () => {
      const allocations = await getSellingPlans(variantId);
      if (!cancelled) setPlans(allocations);
    })();
    return () => {
      cancelled = true;
    };
  }, [isReady, variantId]);

  const selectedPlan = plans.find(
    (p) => p.sellingPlan.id === selectedPlanId,
  );

  return (
    <div className={className}>
      <AnimatePresence initial={false}>
        {plans.length > 0 && (
          <motion.fieldset
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 overflow-hidden"
          >
            <legend className="sr-only">{t("legend")}</legend>

            {/* One-time */}
            <PlanRow
              checked={selectedPlanId === null}
              onSelect={() => setSelectedPlanId(null)}
              title={t("oneTime")}
              detail={`€${price}`}
            />

            {/* Subscription plans */}
            {plans.map((allocation) => {
              const percent = sellingPlanPercentOff(allocation, price);
              const planPrice =
                allocation.priceAdjustments[0]?.price.amount ?? null;
              return (
                <PlanRow
                  key={allocation.sellingPlan.id}
                  checked={selectedPlanId === allocation.sellingPlan.id}
                  onSelect={() =>
                    setSelectedPlanId(allocation.sellingPlan.id)
                  }
                  title={
                    percent !== null
                      ? t("subscribe", { percent })
                      : allocation.sellingPlan.name
                  }
                  detail={
                    planPrice
                      ? `€${Number(planPrice).toFixed(0)} ${t("perDelivery")}`
                      : t("perDelivery")
                  }
                  hint={t("cancelAnytime")}
                />
              );
            })}
          </motion.fieldset>
        )}
      </AnimatePresence>

      <AddToCartButton
        variantId={variantId}
        sellingPlanId={selectedPlan?.sellingPlan.id}
        label={tCart("addToBag")}
        addedLabel={tCart("added")}
        notReadyLabel={tCart("notReady")}
      />
    </div>
  );
}

interface PlanRowProps {
  checked: boolean;
  onSelect: () => void;
  title: string;
  detail: string;
  hint?: string;
}

function PlanRow({ checked, onSelect, title, detail, hint }: PlanRowProps) {
  return (
    <label
      className={`mb-3 flex cursor-pointer items-start gap-3 rounded-card border-2 px-5 py-4 transition-all duration-150 ease-spritz ${
        checked
          ? "border-ink bg-paper shadow-hard-sm"
          : "border-line bg-paper hover:border-ink"
      }`}
    >
      <input
        type="radio"
        name="purchase-option"
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        aria-hidden
        className={`mt-[3px] inline-block h-3.5 w-3.5 shrink-0 rounded-full border-2 border-ink transition-colors ${
          checked ? "bg-red" : "bg-paper"
        }`}
      />
      <span className="flex flex-1 flex-col">
        <span className="font-sans text-[11px] font-bold uppercase tracking-[0.12em]">
          {title}
        </span>
        <span className="mt-1 font-sans text-[13px] text-muted">{detail}</span>
        {hint && checked ? (
          <span className="sp-eyebrow mt-1">{hint}</span>
        ) : null}
      </span>
    </label>
  );
}
