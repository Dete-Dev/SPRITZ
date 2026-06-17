"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCart } from "@/components/cart/CartProvider";
import { useBundle } from "./BundleProvider";
import BundleSlots from "./BundleSlots";

/**
 * Persistent bundle bar — pinned to the bottom of the viewport across the
 * whole shop. Appears the moment the visitor starts a set and follows them
 * from page to page (state lives in BundleProvider), so they can keep
 * adding scents from any product page and check out from anywhere.
 *
 * Shows the slot row (with tier rewards), live tier progress, the estimated
 * total, and the add-to-bag CTA. Hidden when the bundle is empty.
 */
export default function BundleBar() {
  const t = useTranslations("bundle");
  const tCart = useTranslations("cart");
  const { isReady, loading } = useCart();
  const {
    slots,
    count,
    estimate,
    next,
    unlocked,
    variantsMissing,
    removeAt,
    clear,
    addAllToCart,
  } = useBundle();

  const [error, setError] = useState<string | null>(null);
  const visible = count > 0;

  // Keep the fixed bar from covering page content at the very bottom.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.paddingBottom = visible ? "8.5rem" : "";
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [visible]);

  const notReady = !isReady || variantsMissing;
  const canSubmit = isReady && !variantsMissing && !loading;

  async function handleAddAll(): Promise<void> {
    if (!canSubmit) return;
    setError(null);
    try {
      await addAllToCart();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not add to cart");
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          aria-label={t("barLabel")}
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-bone/95 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-6 md:px-8 md:py-4">
            {/* Slots */}
            <div className="min-w-0 flex-1">
              <BundleSlots slots={slots} onRemove={removeAt} compact />
            </div>

            {/* Progress + total */}
            <div className="shrink-0 text-left md:text-right">
              <p className="text-[10px] uppercase tracking-[0.3em] text-ink/60">
                {next
                  ? t("tierProgress", {
                      count: next.remaining,
                      percent: next.tier.percentOff,
                    })
                  : unlocked
                    ? t("tierUnlocked", { percent: unlocked.percentOff })
                    : ""}
              </p>
              <p className="mt-1 font-display text-2xl text-ink">
                {estimate.percentOff > 0 && (
                  <span className="mr-2 text-base text-ink/35 line-through">
                    {estimate.subtotal}
                  </span>
                )}
                {estimate.total}{" "}
                <span className="text-sm text-ink/55">RON</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={clear}
                aria-label={t("clear")}
                className="text-[10px] uppercase tracking-[0.3em] text-ink/45 hover:text-ink"
              >
                {t("clear")}
              </button>
              <button
                type="button"
                onClick={handleAddAll}
                disabled={!canSubmit}
                className="inline-flex items-center justify-center rounded-full border border-ink/70 bg-ink px-6 py-2.5 text-[11px] uppercase tracking-[0.3em] text-ivory transition-colors hover:bg-transparent hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                {notReady ? tCart("notReady") : t("addAll", { count })}
              </button>
            </div>
          </div>
          {error && (
            <p className="px-8 pb-2 text-center text-[10px] uppercase tracking-[0.3em] text-rust">
              {error}
            </p>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
