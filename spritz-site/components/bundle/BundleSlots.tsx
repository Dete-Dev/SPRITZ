"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SCENTS } from "@/lib/scents";
import { BUNDLE_TIERS } from "@/lib/bundle";

interface BundleSlotsProps {
  /** Ordered scent keys currently in the bundle, one per filled slot. */
  slots: string[];
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
}: BundleSlotsProps) {
  const tCart = useTranslations("cart");
  const slotCount = Math.max(TOP_TIER_QTY, slots.length + 1);

  return (
    <div
      className={`-mx-1 flex overflow-x-auto px-1 pb-2 ${
        compact ? "gap-2" : "gap-3"
      }`}
    >
      {Array.from({ length: slotCount }, (_, i) => {
        const position = i + 1;
        const scentKey = slots[i];
        const scent = scentKey
          ? SCENTS.find((s) => s.key === scentKey)
          : undefined;
        const tier = TIER_BY_QTY.get(position);

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
              className={`relative flex h-full w-full items-center justify-center rounded-2xl border text-center transition-colors ${
                scent
                  ? "border-solid border-ink/15 bg-[#faf5ea]"
                  : "border-dashed border-ink/25 bg-[#faf5ea]/60"
              }`}
            >
              <AnimatePresence mode="wait">
                {scent ? (
                  <motion.button
                    key="filled"
                    type="button"
                    onClick={() => onRemove(i)}
                    aria-label={tCart("remove")}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="group absolute inset-0 flex items-center justify-center"
                  >
                    <Image
                      src={scent.clean}
                      alt={scent.name}
                      fill
                      sizes="140px"
                      className={`object-contain ${compact ? "p-1.5" : "p-3"}`}
                    />
                    <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-ink/0 text-[10px] uppercase tracking-[0.28em] text-ink/0 transition-colors group-hover:bg-ivory/80 group-hover:text-ink">
                      {tCart("remove")}
                    </span>
                    <span
                      aria-hidden
                      className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: scent.accent }}
                    />
                  </motion.button>
                ) : tier ? (
                  <motion.span
                    key="reward"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`px-1 font-medium uppercase tracking-[0.08em] text-rust ${
                      compact
                        ? "text-[0.55rem]"
                        : "text-[clamp(0.7rem,1.3vw,0.95rem)]"
                    }`}
                  >
                    −{tier.percentOff}%
                  </motion.span>
                ) : (
                  <motion.span
                    key="plus"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-rust/70 ${compact ? "text-base" : "text-2xl"}`}
                  >
                    +
                  </motion.span>
                )}
              </AnimatePresence>

              <span
                className={`absolute tabular-nums text-amber/70 ${
                  compact
                    ? "bottom-0.5 right-1 text-[8px]"
                    : "bottom-1.5 right-2 text-[11px]"
                }`}
              >
                {position}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
