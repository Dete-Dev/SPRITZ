/**
 * SPRITZ bundle tier discount.
 *
 * Counts bottles across ALL cart lines, picks the highest unlocked tier,
 * and applies one percentage discount targeting every product line.
 *
 * Tier truth order:
 * 1. The discount node's `spritz.tiers` JSON metafield (owner-editable in
 *    admin without redeploying) — value shape: [{"minQuantity":2,"percentOff":10},...]
 * 2. FALLBACK_TIERS below (keep in sync with spritz-site/lib/bundle.ts,
 *    which drives the storefront estimate).
 *
 * Business decision flagged at deploy: subscription lines (those with a
 * sellingPlanAllocation) currently DO count toward the tier and DO get
 * discounted. Flip INCLUDE_SUBSCRIPTION_LINES to false to exclude them.
 *
 * Owner decision: a line is excluded from the tiers entirely — it neither
 * counts toward the quantity nor receives the percentage — when it is
 *
 * - a 15ml bottle, so five 15ml cannot unlock the top tier on the cheapest
 *   thing in the catalogue, or
 * - a set SKU (the curated duos, and the two build-your-own sets), because
 *   a set price already has its own discount baked in. Discounting it again
 *   would take the same bottles off twice.
 *
 * Both are identified from the storefront's own naming: the variant title
 * carries the size, and every set product must carry the `spritz-set` tag in
 * admin. If a set is ever published without that tag it will be double
 * discounted, so the tag belongs on the product-creation checklist.
 */

interface BundleTier {
  minQuantity: number;
  percentOff: number;
}

const FALLBACK_TIERS: BundleTier[] = [
  { minQuantity: 2, percentOff: 10 },
  { minQuantity: 3, percentOff: 15 },
  { minQuantity: 5, percentOff: 20 },
];

const INCLUDE_SUBSCRIPTION_LINES = true;

/** Variant titles that must never take part in the tiers. */
const EXCLUDED_TITLE_PATTERN = /15\s*ml|travel\s*set/i;

/* The set tag itself is asked for in run.graphql (`hasAnyTag(tags:
   ["spritz-set"])`), so `product.hasAnyTag` below is already "is this a
   set?". Change the tag in that query, not here. */

// Shapes matching src/run.graphql. When the CLI is available, replace with
// `npm run typegen` output (generated/api.ts) for exact schema types.
interface RunInput {
  cart: {
    lines: Array<{
      id: string;
      quantity: number;
      sellingPlanAllocation: { sellingPlan: { id: string } } | null;
      merchandise: {
        __typename: string;
        id?: string;
        title?: string;
        product?: { hasAnyTag: boolean };
      };
    }>;
  };
  discountNode: {
    metafield: { value: string } | null;
  };
}

interface FunctionRunResult {
  discountApplicationStrategy: "FIRST" | "MAXIMUM";
  discounts: Array<{
    message?: string;
    targets: Array<{ cartLine: { id: string } }>;
    value: { percentage: { value: string } };
  }>;
}

const EMPTY: FunctionRunResult = {
  discountApplicationStrategy: "FIRST",
  discounts: [],
};

function parseTiers(input: RunInput): BundleTier[] {
  const raw = input.discountNode.metafield?.value;
  if (!raw) return FALLBACK_TIERS;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      Array.isArray(parsed) &&
      parsed.every(
        (t): t is BundleTier =>
          typeof t === "object" &&
          t !== null &&
          typeof (t as BundleTier).minQuantity === "number" &&
          typeof (t as BundleTier).percentOff === "number",
      )
    ) {
      return [...parsed].sort((a, b) => a.minQuantity - b.minQuantity);
    }
  } catch {
    // Malformed metafield — fall through to the safe default.
  }
  return FALLBACK_TIERS;
}

/**
 * A line takes part in the tiers only if it is a plain single bottle.
 * Anything already sold at a set price, and every 15ml, sits this out.
 */
export function participatesInTiers(line: RunInput["cart"]["lines"][number]): boolean {
  if (line.merchandise.__typename !== "ProductVariant") return false;
  if (!INCLUDE_SUBSCRIPTION_LINES && line.sellingPlanAllocation !== null) {
    return false;
  }
  if (line.merchandise.product?.hasAnyTag) return false;
  const title = line.merchandise.title ?? "";
  return !EXCLUDED_TITLE_PATTERN.test(title);
}

export function run(input: RunInput): FunctionRunResult {
  const eligibleLines = input.cart.lines.filter(participatesInTiers);

  const totalQuantity = eligibleLines.reduce(
    (sum, line) => sum + line.quantity,
    0,
  );

  const tiers = parseTiers(input);
  let unlocked: BundleTier | null = null;
  for (const tier of tiers) {
    if (totalQuantity >= tier.minQuantity) unlocked = tier;
  }
  if (!unlocked || eligibleLines.length === 0) return EMPTY;

  return {
    discountApplicationStrategy: "FIRST",
    discounts: [
      {
        message: `SPRITZ bundle -${unlocked.percentOff}%`,
        targets: eligibleLines.map((line) => ({
          cartLine: { id: line.id },
        })),
        value: { percentage: { value: unlocked.percentOff.toFixed(1) } },
      },
    ],
  };
}
