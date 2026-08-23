"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useBundle } from "./BundleProvider";
import { SCENTS } from "@/lib/scents";

/**
 * "What is included" — brief §15, the preset-set readout applied to the
 * custom set. Lists the bottles actually chosen, with the thumbnail, name
 * and what each one answers to, plus the discount currently unlocked.
 *
 * Hidden while the set is empty; the slots above already say what to do.
 */
export default function BundleIncluded() {
  const t = useTranslations("packSelector");
  const tBundle = useTranslations("bundle");
  const tCommon = useTranslations("common");
  const { slots, estimate } = useBundle();

  if (slots.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-card border-2 border-ink bg-paper-2">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-ink px-5 py-3">
        <p className="sp-eyebrow">{t("includedTitle")}</p>
        {estimate.percentOff > 0 ? (
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-red">
            {tBundle("tierUnlocked", { percent: estimate.percentOff })}
          </p>
        ) : null}
      </div>

      <ul className="divide-y divide-line">
        {slots.map((key, idx) => {
          const scent = SCENTS.find((s) => s.key === key);
          if (!scent) return null;
          return (
            <li
              key={`${key}-${idx}`}
              className="flex items-center gap-4 px-5 py-3"
            >
              <span className="relative h-12 w-9 shrink-0">
                <Image
                  src={scent.clean}
                  alt=""
                  fill
                  sizes="36px"
                  className="object-contain"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-sans text-sm font-semibold text-ink">
                  {scent.name}
                </span>
                <span className="block truncate font-sans text-xs text-muted">
                  {tCommon("inspiredBy", { name: scent.inspiredBy })}
                </span>
              </span>
              <span className="shrink-0 font-sans text-sm font-bold">
                {tCommon("price", { price: scent.price })}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
