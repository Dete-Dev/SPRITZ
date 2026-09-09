import assert from "node:assert/strict";
import { test } from "node:test";
import { readableInk } from "./color.ts";

const INK = "#0a0a0a";
const CREAM = "#f4ede2";

test("dark stripes get cream text", () => {
  // Black on these lands between 2.4:1 and 3.5:1 — under AA.
  for (const dark of ["#951929", "#136a39", "#6b492e", "#7c1a3a", "#6c4225"]) {
    assert.equal(readableInk(dark), CREAM, dark);
  }
});

test("light stripes keep ink text", () => {
  for (const light of ["#dac249", "#fa7db3", "#3bc7f9", "#c8d32b", "#fda654"]) {
    assert.equal(readableInk(light), INK, light);
  }
});

test("whichever it picks actually clears AA", () => {
  const lum = (hex: string) => {
    const r = hex.replace("#", "");
    const ch = [0, 2, 4].map((i) => {
      const v = parseInt(r.slice(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const ratio = (a: string, b: string) => {
    const [hi, lo] = lum(a) > lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)];
    return (hi + 0.05) / (lo + 0.05);
  };

  // Every stripe colour shipping in lib/scents.ts.
  const stripes = [
    "#136a39", "#35b68d", "#3bc7f9", "#69c788", "#6b492e", "#6c4225",
    "#7c1a3a", "#8a4a22", "#8b54a5", "#8f7fc4", "#951929", "#b5268c",
    "#c66a8b", "#c8d32b", "#c97d2b", "#c97d5a", "#c99b2d", "#caa42b",
    "#d58335", "#dac249", "#fa7db3", "#fda654",
  ];
  for (const s of stripes) {
    assert.ok(ratio(s, readableInk(s)) >= 4.5, `${s} -> ${ratio(s, readableInk(s)).toFixed(2)}:1`);
  }
});

test("shorthand hex and junk are handled", () => {
  assert.equal(readableInk("#000"), CREAM);
  assert.equal(readableInk("#fff"), INK);
  assert.equal(readableInk("not-a-colour"), INK);
  assert.equal(readableInk("var(--sp-red)"), INK);
});
