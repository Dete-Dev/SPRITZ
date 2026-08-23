/**
 * Gift sets — brief §12.
 *
 * SPRITZ sells one size and no boxed SKUs, so a "set" is a pre-picked
 * selection of bottles that already exist, priced by the ordinary bundle
 * tiers in lib/bundle.ts. Nothing here invents a product or a price: pick
 * the same bottles by hand in the builder and you pay exactly the same.
 *
 * `nameKey` / `blurbKey` resolve under `sets.presets.<key>` in messages.
 */
import { estimateBundleTotal } from "@/lib/bundle";
import { SCENTS, type Scent } from "@/lib/scents";

export interface PresetSet {
  key: string;
  /** Scent keys in the set, in display order. */
  scentKeys: string[];
}

/** Curated by the house — real bottles, grouped by how they wear together. */
export const PRESET_SETS: readonly PresetSet[] = [
  { key: "fresh-duo", scentKeys: ["mer-bergamote", "cedre-menthe"] },
  { key: "warm-duo", scentKeys: ["safran-ambre", "oud-santal"] },
  { key: "sweet-duo", scentKeys: ["truffe-chocolat", "vanille-cafe"] },
  { key: "her-trio", scentKeys: ["cerise-rose", "ylang-jasmin", "lavande-vanille"] },
  { key: "him-trio", scentKeys: ["cuir-tabac", "poivre-ambre", "menthe-tonka"] },
  {
    key: "discovery-five",
    scentKeys: [
      "mer-bergamote",
      "cerise-rose",
      "cedre-menthe",
      "safran-ambre",
      "truffe-chocolat",
    ],
  },
];

export interface ResolvedSet extends PresetSet {
  scents: Scent[];
  /** Full price before the bundle discount. */
  subtotal: number;
  percentOff: number;
  total: number;
}

/** Resolve a preset to its bottles and the price the tiers actually give it. */
export function resolveSet(preset: PresetSet): ResolvedSet | null {
  const scents = preset.scentKeys
    .map((k) => SCENTS.find((s) => s.key === k))
    .filter((s): s is Scent => Boolean(s));
  if (scents.length !== preset.scentKeys.length) return null;

  const estimate = estimateBundleTotal(
    scents.map((s) => ({ price: s.price, quantity: 1 })),
  );
  return {
    ...preset,
    scents,
    subtotal: estimate.subtotal,
    percentOff: estimate.percentOff,
    total: estimate.total,
  };
}

/** All presets that resolve cleanly, in config order. */
export function resolvedSets(): ResolvedSet[] {
  return PRESET_SETS.map(resolveSet).filter(
    (s): s is ResolvedSet => s !== null,
  );
}
