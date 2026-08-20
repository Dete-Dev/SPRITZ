"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SCENTS } from "@/lib/scents";
import { useCart } from "@/components/cart/CartProvider";
import Cta from "@/components/ui/Cta";
import { Mark, Sticker, StripeBand } from "@/components/ui/vandal";
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
  const tCommon = useTranslations("common");
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
    <div className="overflow-hidden rounded-card border-2 border-ink bg-paper shadow-hard">
      <StripeBand color="var(--sp-red)" height={14} />

      <div className="px-5 py-8 md:px-10 md:py-10">
      <div className="mb-7">
        <h2 className="sp-display text-d-2xl">
          <Mark color="var(--sp-yellow)">{t("headline")}</Mark>
        </h2>
        <p className="mt-5 max-w-xl font-sans text-base text-muted">
          {t("intro")}
        </p>
      </div>

      <div className="mb-7">
        <Sticker tilt={-3} variant="ink" fill="var(--sp-red)">
          {tCommon("tiers")}
        </Sticker>
      </div>

      <BundleSlots slots={slots} onRemove={removeAt} />

      {/* Scent picker — tap a bottle to drop it into the next slot. */}
      <div className="mt-7">
        <p className="sp-eyebrow mb-3">{t("addScent")}</p>
        <div className="flex flex-wrap gap-2">
          {SCENTS.map((scent) => (
            <button
              key={scent.key}
              type="button"
              disabled={loading}
              onClick={() => addScent(scent.key)}
              className="sp-lift group flex items-center gap-2.5 rounded-full border-2 border-ink bg-paper py-1.5 pl-1.5 pr-4 disabled:opacity-40"
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
                  className="h-3 w-3 rounded-full border border-ink"
                  style={{ backgroundColor: scent.stripe }}
                />
                <span className="font-sans text-[11px] font-bold uppercase tracking-[0.1em]">
                  {scent.key}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress + total + CTA */}
      <div className="mt-9 flex flex-col gap-5 border-t-2 border-ink pt-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="sp-eyebrow">
            {next
              ? t("tierProgress", {
                  count: next.remaining,
                  percent: next.tier.percentOff,
                })
              : unlocked
                ? t("tierUnlocked", { percent: unlocked.percentOff })
                : t("emptySelection")}
          </p>
          <p className="mt-3 font-sans text-3xl font-bold">
            {estimate.percentOff > 0 && (
              <span className="sp-strike mr-3 text-xl font-normal text-muted">
                {tCommon("price", { price: estimate.subtotal })}
              </span>
            )}
            {tCommon("price", { price: estimate.total || 0 })}
          </p>
          <p className="sp-eyebrow mt-2">{t("discountNote")}</p>
        </div>

        <div className="md:w-64">
          <Cta
            onClick={handleAddAll}
            variant="primary"
            block
            className={canSubmit ? "" : "pointer-events-none opacity-40"}
          >
            {notReady
              ? tCart("notReady")
              : slots.length === 0
                ? t("emptySelection")
                : justAdded
                  ? tCart("added")
                  : t("addAll", { count: slots.length })}
          </Cta>
          {error && (
            <p className="sp-scrawl mt-3 text-center text-xs text-red">
              {error}
            </p>
          )}
        </div>
      </div>
      </div>

      <StripeBand color="var(--sp-red)" height={14} />
    </div>
  );
}
