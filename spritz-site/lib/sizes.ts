/**
 * The two ways a perfume is sold — catalog spec §1, products 1-22.
 *
 * Every scent is offered as a plain 50ml bottle, or as the Travel Set: the
 * same 50ml plus a 15ml companion of the same scent.
 *
 * Pricing rules, decided with the owner:
 *
 * - A 15ml is never sold on its own. It only ever ships inside a set, so
 *   there is no standalone 15ml SKU and none of these prices stand alone.
 * - A set carries its multi-bottle discount *inside* its own price. It does
 *   NOT also collect the cart-wide tiers in ./bundle — that would discount
 *   the same bottles twice. The Shopify Function must exclude set SKUs for
 *   the same reason; see ../spritz-shopify-app.
 * - These numbers are the price the SKU must be given in Shopify admin. They
 *   are constants, not derived from BUNDLE_TIERS, precisely so that re-cutting
 *   a tier cannot silently disagree with what the store actually charges.
 */

/** A 15ml companion bottle, as priced inside a set. */
export const ML_15_PRICE = 40;

/** Discount already baked into a two-bottle set price. Mirrors BUNDLE_TIERS[0]. */
const SET_2_PERCENT_OFF = 10;

/** Discount already baked into a three-bottle set price. Mirrors BUNDLE_TIERS[1]. */
const SET_3_PERCENT_OFF = 15;

/** Which variant of a perfume product you are buying on its own page. */
export type SizeKey = "50ml" | "travel";

/** A single bottle inside a set. The 15ml is only ever sold this way. */
export type BottleSize = "50ml" | "15ml";

/** Undiscounted worth of a 50ml + 15ml pair, for the struck-through price. */
export function travelSetSubtotal(basePrice: number): number {
  return basePrice + ML_15_PRICE;
}

/** What a 50ml + 15ml Travel Set actually costs. €126 at the €100 base. */
export function travelSetPrice(basePrice: number): number {
  const subtotal = travelSetSubtotal(basePrice);
  return subtotal - Math.round((subtotal * SET_2_PERCENT_OFF) / 100);
}

/** Undiscounted worth of the 3 × 15ml discovery trio (spec product 35). */
export function trioSetSubtotal(): number {
  return ML_15_PRICE * 3;
}

/** What the 3 × 15ml discovery trio actually costs. €102. */
export function trioSetPrice(): number {
  const subtotal = trioSetSubtotal();
  return subtotal - Math.round((subtotal * SET_3_PERCENT_OFF) / 100);
}

export const TRAVEL_SET_PERCENT_OFF = SET_2_PERCENT_OFF;
export const TRIO_SET_PERCENT_OFF = SET_3_PERCENT_OFF;

/** What one bottle of this size costs, undiscounted. */
export function bottlePrice(basePrice: number, size: BottleSize): number {
  return size === "15ml" ? ML_15_PRICE : basePrice;
}

/**
 * The two build-your-own sets — catalog spec products 34 and 35.
 *
 * `slots` is the required composition, so the builder knows how many bottles
 * of which size the customer still owes. The percentage is baked into the
 * price the same way it is for a curated set: a shaped set never also
 * collects the cart-wide tiers in ./bundle.
 */
export interface SetShape {
  key: SetShapeKey;
  slots: readonly BottleSize[];
  percentOff: number;
}

export type SetShapeKey = "duo" | "trio";

export const SET_SHAPES: readonly SetShape[] = [
  { key: "duo", slots: ["50ml", "15ml"], percentOff: SET_2_PERCENT_OFF },
  { key: "trio", slots: ["15ml", "15ml", "15ml"], percentOff: SET_3_PERCENT_OFF },
];

export function setShape(key: SetShapeKey): SetShape | null {
  return SET_SHAPES.find((s) => s.key === key) ?? null;
}
