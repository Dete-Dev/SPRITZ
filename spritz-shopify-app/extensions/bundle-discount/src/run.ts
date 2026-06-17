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

// Shapes matching src/run.graphql. When the CLI is available, replace with
// `npm run typegen` output (generated/api.ts) for exact schema types.
interface RunInput {
  cart: {
    lines: Array<{
      id: string;
      quantity: number;
      sellingPlanAllocation: { sellingPlan: { id: string } } | null;
      merchandise: { __typename: string; id?: string };
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

export function run(input: RunInput): FunctionRunResult {
  const eligibleLines = input.cart.lines.filter(
    (line) =>
      line.merchandise.__typename === "ProductVariant" &&
      (INCLUDE_SUBSCRIPTION_LINES || line.sellingPlanAllocation === null),
  );

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
