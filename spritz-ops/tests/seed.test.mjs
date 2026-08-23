/**
 * The SKU seed is generated from the storefront catalogue. These check the
 * generation, since the database it targets is not reachable from here.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SCENTS } from "../../spritz-site/lib/scents.ts";

const OPS = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SQL = readFileSync(resolve(OPS, "supabase/migrations/0004_seed_skus.sql"), "utf8");

test("every catalogue key reaches the seed", () => {
  for (const s of SCENTS) {
    assert.ok(SQL.includes(`('${s.key}',`), `missing SKU ${s.key} — regenerate with npm run seed:skus`);
  }
});

test("keys are unique — a duplicate would silently upsert over its twin", () => {
  const keys = SCENTS.map((s) => s.key);
  assert.equal(new Set(keys).size, keys.length);
});

test("apostrophes are escaped, not left to end the string early", () => {
  // "Kilian Angels' Share" is in the catalogue and would break the INSERT raw.
  const risky = SCENTS.filter((s) => (s.inspiredBy ?? "").includes("'"));
  assert.ok(risky.length > 0, "no apostrophe in the catalogue — this test stopped testing anything");
  for (const s of risky) {
    assert.ok(SQL.includes(s.inspiredBy.replace(/'/g, "''")));
  }
});

test("diacritics survive into the SQL", () => {
  assert.ok(SQL.includes("âme de mer et bergamote"));
});

test("prices are cents, not euros", () => {
  assert.ok(SQL.includes(", 10000, "), "100 EUR must be written as 10000 cents");
  assert.ok(!SQL.includes(", 100, "), "a bare 100 would be one euro");
});

test("the seed asserts the catalogue size rather than trusting it", () => {
  assert.ok(SQL.includes(`found %`) && SQL.includes(`<> ${SCENTS.length}`));
});
