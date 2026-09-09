#!/usr/bin/env node
/**
 * Batch image pipeline for SPRITZ product shots.
 *
 *   archive PNG → ML-remove background → WebP with alpha @ 1600px wide
 *   (plus a 2400px retina variant for hero shots)
 *
 * Each output is a transparent cutout — the bottle and its props sit on the
 * page's accent tint instead of inside a gray studio box. Run via:
 *
 *   npm i --no-save @imgly/background-removal-node
 *   node scripts/optimize-images.mjs
 *
 * The background-removal package is NOT a project dependency. It pulls
 * onnxruntime-node, which downloads ~290 MB of native binaries during install
 * — on every deploy build, for a script no build ever runs. Install it on
 * demand instead.
 *
 * Re-runnable: existing files are overwritten.
 */

import { mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { removeBackground } from "@imgly/background-removal-node";
import sharp from "sharp";

const ARCHIVE = "/Users/detesanuandrei/Desktop/SPRITZ/archive (1)";
const OUT = "/Users/detesanuandrei/Desktop/SPRITZ/spritz-site/public/images/scents";

const ASSETS = [
  // ananas / pineapple + birch
  { src: "hf_20260603_192548_dac01427-93db-4733-b088-f2119461c0fd.png",
    out: "ananas/hero.webp", hero: true },
  { src: "hf_20260603_192747_6ab8a0ac-1ca0-42f5-b977-84117b304311.png",
    out: "ananas/dewy-alt.webp" },
  { src: "hf_20260603_193130_6bfb5533-fda0-4830-aa3c-b721b496c387.png",
    out: "ananas/clean.webp" },

  // truffe / truffle + chocolate
  { src: "hf_20260604_080825_6d82cf8d-e552-47ab-917d-37e011e07815.png",
    out: "truffe/hero.webp", hero: true },
  { src: "hf_20260604_080814_9a1acc0f-c6a0-419d-8471-ca7e9e4125f0.png",
    out: "truffe/dewy-alt.webp" },
  { src: "hf_20260604_080445_a18b59a9-eaff-42cf-a37b-642e3eca9238.png",
    out: "truffe/clean.webp" },

  // menthe / cedar + mint
  { src: "hf_20260604_083748_177d4193-fd35-41a0-9c8e-66b86c52fae7.png",
    out: "menthe/hero.webp", hero: true },
  { src: "hf_20260604_083734_8ee5234e-1922-48f5-9679-8ada5bd32015.png",
    out: "menthe/clean-props.webp" },
  { src: "hf_20260604_083235_3f77bed9-6bd9-489c-84f4-c3e81119117c.png",
    out: "menthe/clean.webp" },

  // safran / saffron + amber
  { src: "hf_20260604_112322_0956d5bf-4ca7-4f20-883f-31c197352571.png",
    out: "safran/hero.webp", hero: true },
  { src: "hf_20260604_112133_9a7c1a13-8a3e-4416-b83f-50d9d89a1e6d.png",
    out: "safran/clean-props.webp" },
  { src: "hf_20260604_112154_06249e93-a2d4-4e6d-ba5d-d68fe2ad9295.png",
    out: "safran/clean-props-alt.webp" },
  { src: "hf_20260604_090426_122d81b8-b3e6-40d3-a65f-80bec63d1498.png",
    out: "safran/clean.webp" },

  // cerise / cherry + rose
  { src: "hf_20260604_114603_75cf3b06-ed8c-40a9-8a03-f581095071cc.png",
    out: "cerise/hero.webp", hero: true },
  { src: "hf_20260604_114018_e51b9745-b10d-4422-8f33-5e74a6924137.png",
    out: "cerise/clean.webp" },
];

async function convertOne({ src, out, hero }) {
  const inputPath = join(ARCHIVE, src);
  const outputPath = join(OUT, out);
  await mkdir(dirname(outputPath), { recursive: true });

  const srcBuffer = await readFile(inputPath);
  const srcBlob = new Blob([srcBuffer], { type: "image/png" });

  // ML bg removal returns a Blob of PNG bytes with alpha.
  const cutoutBlob = await removeBackground(srcBlob);
  const cutoutBuffer = Buffer.from(await cutoutBlob.arrayBuffer());

  // 1600px-wide WebP for normal display, alpha preserved.
  await sharp(cutoutBuffer)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 85, alphaQuality: 90, effort: 6 })
    .toFile(outputPath);

  // Hero shots: also write a 2400px retina version.
  if (hero) {
    const retinaPath = outputPath.replace(/\.webp$/, "@2x.webp");
    await sharp(cutoutBuffer)
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 85, alphaQuality: 90, effort: 6 })
      .toFile(retinaPath);
  }
}

console.log(`Processing ${ASSETS.length} images (ML bg removal — ~6s each)…`);
const start = Date.now();
let okCount = 0;

for (const asset of ASSETS) {
  const t = Date.now();
  try {
    await convertOne(asset);
    console.log(`  ✓ ${asset.out}  (${((Date.now() - t) / 1000).toFixed(1)}s)`);
    okCount += 1;
  } catch (err) {
    console.error(`  ✗ ${asset.out} — ${err.message}`);
  }
}

console.log(
  `Done. ${okCount}/${ASSETS.length} in ${Math.round((Date.now() - start) / 1000)}s.`,
);
