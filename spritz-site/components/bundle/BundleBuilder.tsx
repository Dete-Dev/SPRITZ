"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate } from "animejs";
import { useTranslations } from "next-intl";
import {
  SCENTS,
  type ScentFamily,
  type ScentGender,
} from "@/lib/scents";
import { useCart } from "@/components/cart/CartProvider";
import Chip from "@/components/ui/Chip";
import Cta from "@/components/ui/Cta";
import { Sticker } from "@/components/ui/vandal";
import { prefersReducedMotion } from "@/lib/motion";
import { useBundle } from "./BundleProvider";
import BundleSlots from "./BundleSlots";

/**
 * Slot-style bundle builder (Dossier-inspired) — the tool half of the
 * /bundle page, which owns the heading furniture around it. Reads the
 * shared bundle state from BundleProvider, so the set is the same one the
 * persistent bar carries across pages. Tap a scent to drop it into the next
 * slot; tier rewards (−10/−15/−20%) show on the slots. One CTA adds the set.
 *
 * The total is a client estimate from lib/bundle.ts; the authoritative
 * discount is applied by the Shopify Function at checkout (discountNote).
 */
const FAMILIES: ScentFamily[] = ["fresh", "floral", "warm", "sweet"];
const GENDERS: ScentGender[] = ["her", "him", "unisex"];

export default function BundleBuilder() {
  const t = useTranslations("bundle");
  const tCart = useTranslations("cart");
  const tCommon = useTranslations("common");
  const tShop = useTranslations("shop");
  const tFamilies = useTranslations("families");
  const { isReady, loading } = useCart();
  const {
    slots,
    estimate,
    next,
    unlocked,
    variantsMissing,
    shape,
    remainingSizes,
    addScent,
    removeAt,
    clear,
    addAllToCart,
  } = useBundle();

  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Picker filters — local state on purpose: the shop page owns the
  // `?family=` URL params, this widget lives on the landing.
  const [family, setFamily] = useState<ScentFamily | null>(null);
  const [gender, setGender] = useState<ScentGender | null>(null);
  const pickable = SCENTS.filter(
    (s) => (!family || s.family === family) && (!gender || s.gender === gender)
  );

  // One-shot wobble on the tier sticker each time a better tier unlocks.
  const tierStickerRef = useRef<HTMLDivElement | null>(null);
  const prevPercentOff = useRef(0);
  useEffect(() => {
    const pct = unlocked?.percentOff ?? 0;
    if (
      pct > prevPercentOff.current &&
      tierStickerRef.current &&
      !prefersReducedMotion()
    ) {
      animate(tierStickerRef.current, {
        rotate: [0, -4, 3, -2, 0],
        scale: [1, 1.1, 1],
        duration: 550,
        ease: "inOutQuad",
      });
    }
    prevPercentOff.current = pct;
  }, [unlocked]);

  const notReady = !isReady || variantsMissing;
  const shapeComplete = !shape || slots.length === shape.slots.length;
  const canSubmit =
    isReady && !variantsMissing && slots.length > 0 && shapeComplete && !loading;

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
    <div>
      <div ref={tierStickerRef} className="mb-7 flex w-fit items-center gap-3">
        <Sticker tilt={-3} variant="ink" fill="var(--sp-red)">
          {shape
            ? t(`shape.${shape.key}.sticker`, { percent: shape.percentOff })
            : tCommon("tiers")}
        </Sticker>
        {shape ? (
          <button
            type="button"
            onClick={clear}
            className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-muted underline underline-offset-4 hover:text-ink"
          >
            {t("shape.exit")}
          </button>
        ) : null}
      </div>

      <BundleSlots
        slots={slots}
        onRemove={removeAt}
        shapeSizes={shape?.slots}
      />

      {/* Scent picker — tap a bottle to drop it into the next slot. */}
      <div className="mt-7">
        <p className="sp-eyebrow mb-3">{t("addScent")}</p>

        {/* Filter chips — same language as the shop grid. */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Chip selected={!family} onClick={() => setFamily(null)}>
            {tShop("filterAll")}
          </Chip>
          {FAMILIES.map((f) => (
            <Chip
              key={f}
              selected={family === f}
              onClick={() => setFamily(family === f ? null : f)}
            >
              {tFamilies(`names.${f}`)}
            </Chip>
          ))}
          <span aria-hidden className="mx-2 h-6 w-0.5 bg-ink/20" />
          {GENDERS.map((g) => (
            <Chip
              key={g}
              selected={gender === g}
              onClick={() => setGender(gender === g ? null : g)}
            >
              {tShop(`genders.${g}`)}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {pickable.map((scent) => (
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
                  {scent.name}
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
            {shape
              ? remainingSizes.length > 0
                ? t("shape.needs", {
                    count: remainingSizes.length,
                    size: remainingSizes[0],
                  })
                : t("shape.ready", { percent: shape.percentOff })
              : next
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
  );
}
