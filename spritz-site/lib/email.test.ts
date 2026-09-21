import assert from "node:assert/strict";
import { test } from "node:test";
import { isValidEmail, normalizeEmail } from "./email.ts";

test("accepts ordinary addresses", () => {
  for (const ok of [
    "a@b.co",
    "ana.popescu@spritz.ro",
    "ana+bundle@spritz.co.uk",
    "  spaced@spritz.ro  ",
  ]) {
    assert.equal(isValidEmail(ok), true, ok);
  }
});

test("rejects junk, wrong types, and injection attempts", () => {
  for (const bad of [
    "",
    "   ",
    "abc",
    "abc@",
    "@spritz.ro",
    "no-dot@spritz",
    "two@@spritz.ro",
    "sp ace@spritz.ro",
    "inject@spritz.ro\nBcc: evil@x.com",
    "comma@spritz.ro,other@x.com",
    `${"a".repeat(250)}@spritz.ro`,
    null,
    undefined,
    42,
    { email: "a@b.co" },
  ]) {
    assert.equal(isValidEmail(bad), false, JSON.stringify(bad));
  }
});

test("normalize trims and lowercases", () => {
  assert.equal(normalizeEmail("  Ana@SPRITZ.RO "), "ana@spritz.ro");
});
