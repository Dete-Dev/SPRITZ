/**
 * The number-handling that, if it breaks, makes every figure on screen wrong
 * without anything looking broken.
 *
 * The trap this guards: PostgREST returns Postgres `numeric` as a STRING.
 * `"10" + "10"` is `"1010"`, and a cost of 1010 cents next to a price of 10000
 * looks like a plausible margin. Everything goes through `num()` for exactly
 * that reason.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { num, money, qty, marginPct } from "../lib/format.ts";

test("num() converts the strings PostgREST actually sends", () => {
  assert.equal(num("10"), 10);
  assert.equal(num("0.400000"), 0.4);
  assert.equal(num(10), 10);
  assert.equal(num(null), 0);
  assert.equal(num(undefined), 0);
  // The failure this exists to prevent.
  assert.equal(num("10") + num("10"), 20);
});

test("money() reads cents, not euros", () => {
  assert.match(money(10000), /100/);
  assert.match(money("10000"), /100/);
  assert.ok(!money(10000).includes("10.000,00"), "10000 cents is 100 EUR, not 10.000");
});

test("money() keeps sub-cent unit costs from rounding to nothing", () => {
  // 1 ml of alcohol at 0.4 cents. The whole reason unit costs are numeric.
  assert.notEqual(num("0.400000"), 0);
  assert.equal(num("0.400000") * 50, 20); // 50 ml in a bottle = 20 cents
});

test("qty() carries its unit", () => {
  assert.equal(qty(40, "buc"), "40 buc");
  assert.equal(qty("1250.500", "ml"), "1.250,5 ml");
});

test("marginPct() survives a zero price instead of dividing by it", () => {
  assert.equal(marginPct(0, 500), "—");
  assert.equal(marginPct(10000, 7000), "70%");
});
