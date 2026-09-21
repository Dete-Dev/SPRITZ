import { test } from "node:test";
import assert from "node:assert/strict";
import { toE164, prettyPhone } from "../lib/phone.ts";

test("the three ways a Romanian mobile gets typed all land on one string", () => {
  const want = "+40722123456";
  for (const input of [
    "0722 123 456",
    "0722123456",
    "+40 722 123 456",
    "+40722123456",
    "0040722123456",
    "0040 722 123 456",
    "40722123456",
    "722123456",
    "0722-123-456",
    "  0722.123.456  ",
  ]) {
    assert.equal(toE164(input), want, `${input} should normalise to ${want}`);
  }
});

test("a foreign number keeps its own country code", () => {
  assert.equal(toE164("+34 612 345 678"), "+34612345678"); // Alicante, Benidorm
  assert.equal(toE164("0034612345678"), "+34612345678");
});

test("rubbish is rejected rather than stored as a plausible number", () => {
  assert.equal(toE164(""), null);
  assert.equal(toE164("   "), null);
  assert.equal(toE164("nu stiu"), null);
  assert.equal(toE164("123"), null);
  assert.equal(toE164("+1"), null);
});

test("prettyPhone is display only", () => {
  assert.equal(prettyPhone("+40722123456"), "+40 722 123 456");
  assert.equal(prettyPhone(null), "—");
  assert.equal(prettyPhone("+34612345678"), "+34612345678");
});
