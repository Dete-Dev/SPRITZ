/**
 * One runnable check on the money path: which cart lines the tier discount
 * is allowed to touch. Run with `node src/run.test.mjs` from the extension
 * directory — Node strips the TypeScript itself. No framework on purpose.
 *
 * The rules under test (owner decisions, see run.ts header):
 * - a 50ml single takes part in the tiers
 * - a 15ml never does
 * - a Travel Set variant never does
 * - anything tagged `spritz-set` never does
 */
import assert from "node:assert/strict";
import { run, participatesInTiers } from "./run.ts";

const line = (id, quantity, title, isSet = false) => ({
  id,
  quantity,
  sellingPlanAllocation: null,
  merchandise: {
    __typename: "ProductVariant",
    id: `gid://shopify/ProductVariant/${id}`,
    title,
    product: { hasAnyTag: isSet },
  },
});

// --- which lines take part
assert.equal(participatesInTiers(line("a", 1, "50ml")), true);
assert.equal(participatesInTiers(line("b", 1, "15ml")), false);
assert.equal(participatesInTiers(line("c", 1, "50ml + 15ml Travel Set")), false);
assert.equal(participatesInTiers(line("d", 1, "50ml", true)), false);

// --- five 15ml must NOT unlock the top tier
const fifteens = {
  cart: { lines: [line("x", 5, "15ml")] },
  discountNode: { metafield: null },
};
assert.deepEqual(run(fifteens).discounts, [], "15ml must never discount");

// --- a set SKU must not be discounted again on top of its own price
const setOnly = {
  cart: { lines: [line("s", 2, "Signature Duo", true)] },
  discountNode: { metafield: null },
};
assert.deepEqual(run(setOnly).discounts, [], "sets are already discounted");

// --- two plain 50ml still unlock 10%, and only that line is targeted
const mixed = {
  cart: { lines: [line("p", 2, "50ml"), line("q", 3, "15ml")] },
  discountNode: { metafield: null },
};
const out = run(mixed);
assert.equal(out.discounts.length, 1);
assert.equal(out.discounts[0].value.percentage.value, "10.0");
assert.deepEqual(
  out.discounts[0].targets.map((t) => t.cartLine.id),
  ["p"],
  "the 15ml line must not receive the discount",
);

console.log("run.test.mjs: all checks passed");
