"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SCENTS } from "@/lib/scents";
import { BUNDLE_TIERS } from "@/lib/bundle";
import type { BundleSlot } from "./BundleProvider";

interface BundleSlotsProps {
  /** Ordered bottles currently in the bundle, one per filled slot. */
  slots: BundleSlot[];
  /** Fixed composition when building a shaped set; drives the empty slots. */
  shapeSizes?: readonly string[];
  /** Remove the bottle at slot index (shifts the rest left). */
  onRemove: (index: number) => void;
  /** Smaller slots for the persistent bottom bar. */
  compact?: boolean;
}

const TOP_TIER_QTY = BUNDLE_TIERS[BUNDLE_TIERS.length - 1].minQuantity;
const TIER_BY_QTY = new Map(BUNDLE_TIERS.map((t) => [t.minQuantity, t]));

/**
 * Dossier-style slot row. Filled slots show the chosen bottle; empty slots
 * at a tier threshold show the reward (−X%), the rest show a plain +.
 * Always renders at least one trailing empty slot so the set can grow.
 */
export default function BundleSlots({
  slots,
  onRemove,
  compact = false,
  shapeSizes,
}: BundleSlotsProps) {
  const tCart = useTranslations("cart");
  /* A shaped set shows exactly its own slots — no growing row, no tier
     rewards, because its discount does not come from the tiers. */
  const slotCount = shapeSizes
    ? shapeSizes.length
    : Math.max(TOP_TIER_QTY, slots.length + 1);

  return (
    <div
      className={`-mx-1 flex overflow-x-auto px-1 pb-2 ${
        compact ? "gap-2" : "gap-3"
      }`}
    >
      {Array.from({ length: slotCount }, (_, i) => {
        const position = i + 1;
        const slot = slots[i];
        const scent = slot
          ? SCENTS.find((s) => s.key === slot.key)
          : undefined;
        const tier = shapeSizes ? undefined : TIER_BY_QTY.get(position);
        const sizeLabel = slot?.size ?? shapeSizes?.[i];

        return (
          <div
            key={i}
            className={`relative aspect-square shrink-0 ${
              compact
                ? "w-[3.25rem]"
                : "w-[clamp(5rem,18vw,8.5rem)]"
            }`}
          >
            <div
              className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-card border-2 border-ink text-center transition-shadow ${
                scent
                  ? "bg-paper shadow-hard-sm"
                  : "border-dashed bg-paper-2"
              }`}
            >
              <AnimatePresence mode="wait">
                {scent ? (
                  <motion.button
                    key="filled"
                    type="button"
                    onClick={() => onRemove(i)}
                    aria-label={tCart("remove")}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    /* Spring with one visible overshoot — the bottle "drops"
                       into the slot rather than fading in. */
                    transition={{ type: "spring", stiffness: 480, damping: 17 }}
                    className="group absolute inset-0 flex items-center justify-center"
                  >
                    <Image
                      src={scent.clean}
                      alt={scent.name}
                      fill
                      sizes="140px"
                      className={`object-contain ${compact ? "p-1.5" : "p-3"}`}
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-transparent font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-transparent transition-colors group-hover:bg-paper/85 group-hover:text-ink">
                      {tCart("remove")}
                    </span>
                    {/* The scent's own stripe colourway, banded like the label. */}
                    <span
                      aria-hidden
                      className="sp-stripe absolute inset-x-0 bottom-0 h-2"
                      style={{ ["--stripe" as string]: scent.stripe }}
                    />
                  </motion.button>
                ) : tier ? (
                  <motion.span
                    key="reward"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`px-1 font-sans font-bold uppercase tracking-[0.06em] text-red ${
                      compact
                        ? "text-[0.55rem]"
                        : "text-[clamp(0.7rem,1.3vw,0.95rem)]"
                    }`}
                  >
                    −{tier.percentOff}%
                  </motion.span>
                ) : shapeSizes ? (
                  <motion.span
                    key="wants"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`px-1 font-sans font-bold uppercase tracking-[0.06em] text-muted ${
                      compact
                        ? "text-[0.55rem]"
                        : "text-[clamp(0.65rem,1.2vw,0.85rem)]"
                    }`}
                  >
                    + {sizeLabel}
                  </motion.span>
                ) : (
                  <motion.span
                    key="plus"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-muted ${compact ? "text-base" : "text-2xl"}`}
                  >
                    +
                  </motion.span>
                )}
              </AnimatePresence>

              <span
                className={`absolute font-sans tabular-nums text-muted ${
                  compact
                    ? "bottom-0.5 right-1 text-[8px]"
                    : "bottom-1.5 right-2 text-[11px]"
                }`}
              >
                {position}
              </span>

              {scent && sizeLabel ? (
                <span
                  className={`absolute left-0 top-0 bg-ink px-1.5 py-0.5 font-sans font-bold uppercase tracking-[0.08em] text-paper ${
                    compact ? "text-[7px]" : "text-[10px]"
                  }`}
                >
                  {sizeLabel}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
