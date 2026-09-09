/**
 * The one check that keeps spritz-ops looking like SPRITZ.
 *
 * `sync-ds.mjs --check` runs in `prebuild`, so this test is really asking:
 * does that gate actually fail when a token changes upstream? A gate that
 * never fails is a gate nobody notices is broken.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OPS = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPT = resolve(OPS, "scripts", "sync-ds.mjs");
const UPSTREAM = resolve(OPS, "..", "spritz-site", "app", "tokens", "colors.css");

function check() {
  try {
    execFileSync("node", [SCRIPT, "--check"], { cwd: OPS, stdio: "pipe" });
    return 0;
  } catch (e) {
    return e.status;
  }
}

test("a fresh sync passes the gate", () => {
  execFileSync("node", [SCRIPT], { cwd: OPS, stdio: "pipe" });
  assert.equal(check(), 0);
});

test("an upstream token change fails the gate", () => {
  const original = readFileSync(UPSTREAM, "utf8");
  try {
    writeFileSync(UPSTREAM, original + "\n/* sync-ds test marker */\n");
    assert.notEqual(check(), 0, "--check must fail when spritz-site moves ahead");
  } finally {
    writeFileSync(UPSTREAM, original);
  }
  execFileSync("node", [SCRIPT], { cwd: OPS, stdio: "pipe" });
  assert.equal(check(), 0, "re-syncing must clear it");
});

test("vendored files carry the do-not-edit banner", () => {
  const vendored = readFileSync(resolve(OPS, "components/ui/vandal.tsx"), "utf8");
  assert.match(vendored, /VENDORED from spritz-site/);
});
