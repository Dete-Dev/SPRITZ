/**
 * Bundle tier configuration + helpers.
 *
 * IMPORTANT — two sources of truth by necessity:
 * 1. This file drives the UI estimate (tier meter, projected totals).
 * 2. The Shopify Function in ../spritz-shopify-app reads the authoritative
 *    tiers from the discount node metafield `spritz.tiers` at checkout.
 * When the owner changes percentages, update BOTH (see
 * spritz-shopify-app/README.md for the metafield update mutation).
 */

export interface BundleTier {
  /** Total bottles across the cart needed to unlock this tier. */
  minQuantity: number;
  /** Percent off every eligible line once unlocked. */
  percentOff: number;
}

/** Ascending by minQuantity. Percentages are launch placeholders — owner TBD. */
export const BUNDLE_TIERS: readonly BundleTier[] = [
  { minQuantity: 2, percentOff: 10 },
  { minQuantity: 3, percentOff: 15 },
  { minQuantity: 5, percentOff: 20 },
];

/** Highest tier unlocked at `qty` bottles, or null below the first tier. */
export function tierForQuantity(qty: number): BundleTier | null {
  let unlocked: BundleTier | null = null;
  for (const tier of BUNDLE_TIERS) {
    if (qty >= tier.minQuantity) unlocked = tier;
  }
  return unlocked;
}

/** Next tier above `qty` and how many bottles away it is; null at top tier. */
export function nextTier(
  qty: number,
): { tier: BundleTier; remaining: number } | null {
  for (const tier of BUNDLE_TIERS) {
    if (qty < tier.minQuantity) {
      return { tier, remaining: tier.minQuantity - qty };
    }
  }
  return null;
}

export interface BundleEstimate {
  quantity: number;
  subtotal: number;
  /** Percent applied, 0 below the first tier. */
  percentOff: number;
  discount: number;
  total: number;
}

/**
 * Client-side projection of what the Shopify Function will apply at
 * checkout. Label it as an estimate in the UI — the Function is the truth.
 */
export function estimateBundleTotal(
  items: ReadonlyArray<{ price: number; quantity: number }>,
): BundleEstimate {
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tier = tierForQuantity(quantity);
  const percentOff = tier?.percentOff ?? 0;
  const discount = Math.round((subtotal * percentOff) / 100);
  return { quantity, subtotal, percentOff, discount, total: subtotal - discount };
}
