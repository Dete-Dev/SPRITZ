#!/usr/bin/env node
/**
 * Vendors the Vandal v2 design system from spritz-site into spritz-ops.
 *
 * spritz-ops is a separate app with its own database, but it is the same
 * brand — same tokens, same type, same vandal elements, same motion. Copying
 * by hand means the two drift on colour within a quarter and nobody notices
 * until a screenshot. So the copy is generated, and `--check` fails the build
 * when it is stale (wired into `prebuild`).
 *
 *   node scripts/sync-ds.mjs           # write the copy
 *   node scripts/sync-ds.mjs --check   # exit 1 if the copy is out of date
 *
 * Vendored files are NOT edited here. Edit them in spritz-site and re-sync.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OPS = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = resolve(OPS, "..", "spritz-site");

const BANNER = (from) =>
  `/* VENDORED from spritz-site/${from} by scripts/sync-ds.mjs — do not edit here. */\n`;

/**
 * spritz-site routes every link through next-intl (RO default, EN at /en).
 * spritz-ops is an internal tool in one language, so the only rewrite the
 * vendor pass makes is swapping that Link for the plain next/link one.
 */
const rewrites = [
  [/import \{ Link \} from "@\/i18n\/navigation";/g, `import Link from "next/link";`],
];

/** Files copied verbatim, plus the rewrite pass. Source paths are site-relative. */
function sources() {
  const tokens = readdirSync(join(SITE, "app", "tokens"))
    .filter((f) => f.endsWith(".css"))
    .map((f) => `app/tokens/${f}`);
  return [
    ...tokens,
    "components/ui/vandal.tsx",
    "components/ui/Chip.tsx",
    "components/ui/Cta.tsx",
    "components/ui/Accordion.tsx",
    "components/ui/LabelName.tsx",
    "components/Reveal.tsx",
    "components/SmoothScroll.tsx",
    "components/sectionFade.ts",
    "lib/motion.ts",
  ];
}

/** What the vendored file should contain, given the current source. */
function render(rel) {
  let body = readFileSync(join(SITE, rel), "utf8");
  for (const [from, to] of rewrites) body = body.replace(from, to);
  // CSS keeps its banner in a /* */ too, so one form works for both.
  return BANNER(rel) + body;
}

const check = process.argv.includes("--check");
let stale = 0;

if (!existsSync(SITE)) {
  // On a build server only spritz-ops is uploaded, so there is nothing to
  // compare against — and nothing to compare is not a failure: the vendored
  // copy in this folder IS what ships. The gate is a development guard, and
  // it still fails loudly where it can actually catch drift.
  if (check) {
    console.log("[sync-ds] spritz-site not present — skipping the drift check (build server)");
    process.exit(0);
  }
  console.error(`[sync-ds] spritz-site not found at ${SITE} — cannot sync`);
  process.exit(1);
}

for (const rel of sources()) {
  const want = render(rel);
  const dest = join(OPS, rel);
  const have = existsSync(dest) ? readFileSync(dest, "utf8") : null;
  if (have === want) continue;
  stale++;
  if (check) {
    console.error(`[sync-ds] stale: ${rel}${have === null ? " (missing)" : ""}`);
  } else {
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, want);
    console.log(`[sync-ds] wrote ${rel}`);
  }
}

if (check && stale) {
  console.error(`\n[sync-ds] ${stale} file(s) out of date. Run: npm run sync-ds`);
  process.exit(1);
}
console.log(check ? "[sync-ds] design system up to date" : `[sync-ds] ${stale} file(s) updated`);
