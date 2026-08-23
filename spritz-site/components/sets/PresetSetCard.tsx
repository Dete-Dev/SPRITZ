"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useBundle } from "@/components/bundle/BundleProvider";
import { Sticker, StripeBand } from "@/components/ui/vandal";
import type { ResolvedSet } from "@/lib/sets";

/**
 * A ready-made set — brief §12's preset grid, and §15's "what is included"
 * readout: the bottles are named on the card, not hidden behind a box shot.
 *
 * Choosing one loads exactly those bottles into the builder, where they can
 * still be swapped. Price is the ordinary tier price for that many bottles.
 */
export default function PresetSetCard({ set }: { set: ResolvedSet }) {
  const t = useTranslations("sets");
  const tCommon = useTranslations("common");
  const { loadSet } = useBundle();
  const router = useRouter();

  const stripe = set.scents[0]?.stripe ?? "var(--sp-red)";

  function choose() {
    loadSet(set.scentKeys);
    router.push("/bundle");
  }

  return (
    <button
      type="button"
      onClick={choose}
      className="sp-lift flex h-full w-full flex-col overflow-hidden rounded-card border-2 border-ink bg-paper text-left shadow-hard-sm"
    >
      <div className="relative flex items-end justify-center gap-1.5 bg-paper-2 px-4 pt-6">
        {set.scents.slice(0, 3).map((scent) => (
          <span
            key={scent.key}
            className="relative block w-1/3 max-w-[5rem]"
            style={{ aspectRatio: "1 / 1.6" }}
          >
            <Image
              src={scent.clean}
              alt=""
              fill
              sizes="80px"
              className="object-contain"
            />
          </span>
        ))}
        {set.percentOff > 0 ? (
          <span className="absolute right-3 top-3">
            <Sticker tilt={4} variant="fill" fill="var(--sp-yellow)">
              −{set.percentOff}%
            </Sticker>
          </span>
        ) : null}
      </div>

      <StripeBand color={stripe} height={10} />

      <div className="flex flex-1 flex-col p-5">
        <p className="sp-display text-[1.35rem] leading-tight">
          {t(`presets.${set.key}`)}
        </p>

        {/* Brief §15 — a preset says exactly what you receive. */}
        <ul className="mt-3 space-y-1">
          {set.scents.map((scent) => (
            <li
              key={scent.key}
              className="flex items-center gap-2 font-sans text-[13px] text-muted"
            >
              <span
                aria-hidden
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: scent.stripe }}
              />
              <span className="truncate">{scent.name}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-baseline gap-2 pt-4">
          <span className="sp-strike font-sans text-sm text-muted">
            {tCommon("price", { price: set.subtotal })}
          </span>
          <span className="font-sans text-lg font-bold">
            {tCommon("price", { price: set.total })}
          </span>
        </div>
      </div>
    </button>
  );
}
