#!/usr/bin/env node
/**
 * Editorial artwork pipeline — the cards and banners from the brief.
 *
 *   brand/editorial/out/<slug>.png (4K, ~20 MB) → public/images/editorial/<slug>.webp
 *
 * Unlike scripts/optimize-images.mjs these are NOT cutouts: each one is a
 * full-bleed still-life on a coloured paper sweep, so there is no background
 * to remove — just a resize and a WebP encode. sharp is already a dependency
 * here, so this one runs with no extra install.
 *
 * Re-runnable: existing files are overwritten.
 *
 *   node scripts/optimize-editorial.mjs
 */
import { mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const SRC = new URL("../../brand/editorial/out", import.meta.url).pathname;
const OUT = new URL("../public/images/editorial", import.meta.url).pathname;

// Long edge. Matches the retina tier the hero shots use in optimize-images.mjs;
// every one of these slots is at most half the viewport wide.
const MAX_EDGE = 2400;

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => f.endsWith(".png")).sort();
if (files.length === 0) {
  console.error(`no PNGs in ${SRC} — run brand/editorial/generate.sh first`);
  process.exit(1);
}

for (const file of files) {
  const slug = file.replace(/\.png$/, "");
  const dest = join(OUT, `${slug}.webp`);
  const info = await sharp(join(SRC, file))
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(dest);
  console.log(`${slug.padEnd(20)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
console.log(`\n${files.length} images → public/images/editorial/`);
