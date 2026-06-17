import { getClient } from "./client";
import { VARIANT_SELLING_PLANS_QUERY } from "./queries";
import type { SellingPlanAllocation } from "./types";

/**
 * Fetch the selling plans (subscription options) available for a variant.
 *
 * Returns `[]` in every "not available" case — Shopify unconfigured, empty
 * variant id, unknown variant, no subscription app installed, or network
 * error. The UI treats an empty list as "one-time purchase only", which is
 * exactly the pre-subscription-app behavior.
 */
export async function getSellingPlans(
  variantGid: string,
): Promise<SellingPlanAllocation[]> {
  const client = getClient();
  if (!client || !variantGid) return [];

  try {
    const { data, errors } = await client.request(
      VARIANT_SELLING_PLANS_QUERY,
      { variables: { id: variantGid } },
    );
    if (errors) return [];
    const node = data?.node as
      | { sellingPlanAllocations?: { nodes: SellingPlanAllocation[] } }
      | null
      | undefined;
    return node?.sellingPlanAllocations?.nodes ?? [];
  } catch {
    return [];
  }
}

/**
 * Derive the subscription discount percent from a selling plan allocation,
 * preferring the plan's declared percentage and falling back to comparing
 * the allocated per-delivery price with the base variant price.
 */
export function sellingPlanPercentOff(
  allocation: SellingPlanAllocation,
  basePrice: number,
): number | null {
  const adjustment = allocation.sellingPlan.priceAdjustments[0]?.adjustmentValue;
  if (adjustment && "adjustmentPercentage" in adjustment) {
    return Math.round(adjustment.adjustmentPercentage);
  }
  const planPrice = Number(allocation.priceAdjustments[0]?.price.amount);
  if (Number.isFinite(planPrice) && basePrice > 0 && planPrice < basePrice) {
    return Math.round((1 - planPrice / basePrice) * 100);
  }
  return null;
}
