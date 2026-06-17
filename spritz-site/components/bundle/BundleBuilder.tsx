"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SCENTS } from "@/lib/scents";
import { useCart } from "@/components/cart/CartProvider";
import { useBundle } from "./BundleProvider";
import BundleSlots from "./BundleSlots";

/**
 * Slot-style bundle builder (Dossier-inspired). Reads the shared bundle
 * state from BundleProvider, so the set is the same one the persistent bar
 * carries across pages. Tap a scent to drop it into the next slot; tier
 * rewards (−10/−15/−20%) show on the slots. One CTA adds the whole set.
 *
 * The total is a client estimate from lib/bundle.ts; the authoritative
 * discount is applied by the Shopify Function at checkout (discountNote).
 */
export default function BundleBuilder() {
  const t = useTranslations("bundle");
  const tCart = useTranslations("cart");
  const { isReady, loading } = useCart();
  const {
    slots,
    estimate,
    next,
    unlocked,
    variantsMissing,
    addScent,
    removeAt,
    addAllToCart,
  } = useBundle();

  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notReady = !isReady || variantsMissing;
  const canSubmit = isReady && !variantsMissing && slots.length > 0 && !loading;

  async function handleAddAll(): Promise<void> {
    if (!canSubmit) return;
    setError(null);
    try {
      await addAllToCart();
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not add to cart");
    }
  }

  return (
    <div className="rounded-[2rem] bg-bone/70 px-5 py-8 shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_20px_60px_-40px_rgba(26,20,17,0.4)] md:px-10 md:py-10">
      <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:gap-6">
        <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-[0.95] text-ink">
          {t("headline")}
        </h2>
        <p className="max-w-md text-[14px] leading-relaxed text-ink/65 md:pb-1">
          {t("intro")}
        </p>
      </div>

      <BundleSlots slots={slots} onRemove={removeAt} />

      {/* Scent picker — tap a bottle to drop it into the next slot. */}
      <div className="mt-7">
        <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-ink/45">
          {t("addScent")}
        </p>
        <div className="flex flex-wrap gap-2">
          {SCENTS.map((scent) => (
            <button
              key={scent.key}
              type="button"
              disabled={loading}
              onClick={() => addScent(scent.key)}
              className="group flex items-center gap-2.5 rounded-full border border-ink/20 bg-ivory/50 py-1.5 pl-1.5 pr-4 transition-colors hover:border-ink/50 disabled:opacity-50"
            >
              <span className="relative h-9 w-7">
                <Image
                  src={scent.clean}
                  alt={scent.name}
                  fill
                  sizes="28px"
                  className="object-contain"
                />
              </span>
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: scent.accent }}
                />
                <span className="text-[11px] uppercase tracking-[0.18em] text-ink/75">
                  {scent.key}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress + total + CTA */}
      <div className="mt-9 flex flex-col gap-5 border-t border-ink/12 pt-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-ink/60">
            {next
              ? t("tierProgress", {
                  count: next.remaining,
                  percent: next.tier.percentOff,
                })
              : unlocked
                ? t("tierUnlocked", { percent: unlocked.percentOff })
                : t("emptySelection")}
          </p>
          <p className="mt-3 font-display text-3xl text-ink">
            {estimate.percentOff > 0 && (
              <span className="mr-3 text-xl text-ink/35 line-through">
                {estimate.subtotal}
              </span>
            )}
            {estimate.total || 0}{" "}
            <span className="text-base text-ink/55">RON</span>
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.32em] text-ink/40">
            {t("discountNote")}
          </p>
        </div>

        <div className="md:w-64">
          <button
            type="button"
            onClick={handleAddAll}
            disabled={!canSubmit}
            className="inline-flex w-full items-center justify-center rounded-full border border-ink/70 bg-ink px-7 py-3 text-[11px] uppercase tracking-[0.32em] text-ivory transition-colors hover:bg-transparent hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {notReady
              ? tCart("notReady")
              : slots.length === 0
                ? t("emptySelection")
                : justAdded
                  ? tCart("added")
                  : t("addAll", { count: slots.length })}
          </button>
          {error && (
            <p className="mt-3 text-center text-[11px] uppercase tracking-[0.3em] text-rust">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
