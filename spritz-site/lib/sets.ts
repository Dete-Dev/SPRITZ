/**
 * The curated sets — catalog spec products 23-33.
 *
 * Each one is a fixed pairing: a 50ml anchor and a 15ml companion of a
 * different scent, sold as one SKU. Buying it deducts stock from both single
 * inventories (spec §1), so a set is a real product here, not a pre-filled
 * builder selection as it used to be.
 *
 * Pricing lives in ./sizes. A set price already includes its discount, so
 * these never go through the cart-wide tiers in ./bundle — read the note
 * there before wiring anything to a percentage.
 *
 * `key` doubles as the messages key: `sets.presets.<key>` in messages/*.json.
 */

import { SCENTS, type Scent } from "./scents";
import { ML_15_PRICE, TRAVEL_SET_PERCENT_OFF, travelSetPrice, travelSetSubtotal } from "./sizes";

export interface DuoSet {
  key: string;
  /** Scent key of the 50ml bottle. */
  anchorKey: string;
  /** Scent key of the 15ml bottle. Always a different scent. */
  companionKey: string;
  /**
   * Shopify variant ID for the set as one SKU. Undefined until it exists in
   * admin; the card then shows "store launching soon" like every other
   * product. Buying it deducts stock from both singles — spec §1.
   */
  shopifyVariantId?: string;
}

export const DUO_SETS: readonly DuoSet[] = [
  { key: "signature-duo", anchorKey: "ananas-bouleau", companionKey: "lavande-vanille" },
  { key: "nightfall", anchorKey: "cedre-menthe", companionKey: "menthe-tonka" },
  { key: "cherry-noir", anchorKey: "cerise-rose", companionKey: "amande-tonka" },
  { key: "liquid-gold", anchorKey: "safran-ambre", companionKey: "oud-santal" },
  { key: "velvet-hour", anchorKey: "truffe-chocolat", companionKey: "cognac-bergamote" },
  { key: "off-duty", anchorKey: "mer-bergamote", companionKey: "cuir-menthe" },
  { key: "bloom-burn", anchorKey: "gardenia-mandarin", companionKey: "iris-bergamote" },
  { key: "smoke-signal", anchorKey: "ananas-bouleau", companionKey: "cuir-tabac" },
  { key: "after-hours", anchorKey: "vanille-cafe", companionKey: "safran-ambre" },
  { key: "desert-rose", anchorKey: "rose-jasmin", companionKey: "oud-safran" },
  { key: "reset", anchorKey: "mer-bergamote", companionKey: "cedre-menthe" },
];

export interface ResolvedDuoSet extends DuoSet {
  anchor: Scent;
  companion: Scent;
  /** Anchor and companion in display order — anchor first. */
  scents: Scent[];
  /** Both scent keys, anchor first. */
  scentKeys: string[];
  /** Full price of the two bottles bought apart. */
  subtotal: number;
  percentOff: number;
  total: number;
}

export function resolveSet(set: DuoSet): ResolvedDuoSet | null {
  const anchor = SCENTS.find((s) => s.key === set.anchorKey);
  const companion = SCENTS.find((s) => s.key === set.companionKey);
  if (!anchor || !companion) return null;

  return {
    ...set,
    anchor,
    companion,
    scents: [anchor, companion],
    scentKeys: [anchor.key, companion.key],
    subtotal: travelSetSubtotal(anchor.price),
    percentOff: TRAVEL_SET_PERCENT_OFF,
    total: travelSetPrice(anchor.price),
  };
}

export function resolvedSets(): ResolvedDuoSet[] {
  return DUO_SETS.map(resolveSet).filter((s): s is ResolvedDuoSet => s !== null);
}

/** What the 15ml companion in a set is worth on its own terms. */
export { ML_15_PRICE };
