/**
 * Pull the Top / Heart / Base pyramids for all 22 scents out of
 * docs/catalog.md and write them into messages/{en,ro}.json under
 * scentDetails.<key>.notes. Idempotent — run it again after the catalog
 * changes. Story copy (story1/story2) is left untouched.
 *
 *   node scripts/ingest-notes.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const site = resolve(here, "..");
const catalog = readFileSync(resolve(site, "../docs/catalog.md"), "utf8");
const scentsTs = readFileSync(resolve(site, "lib/scents.ts"), "utf8");

const strip = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z' ]/g, " ").replace(/\s+/g, " ").trim();

// key ↔ printed name from lib/scents.ts
const scents = [...scentsTs.matchAll(/key: "([^"]+)",[\s\S]*?name: "([^"]+)"/g)].map((m) => ({
  key: m[1],
  name: strip(m[2]),
}));

const splitNotes = (line) => {
  const parts = {};
  for (const seg of line.split("|")) {
    const m = seg.match(/^\s*([^:]+):\s*(.+?)\s*$/);
    if (!m) continue;
    parts[strip(m[1])] = m[2].split(",").map((n) => n.trim()).filter(Boolean);
  }
  return parts;
};

const LAYERS = {
  en: { top: "top", heart: "heart", base: "base" },
  ro: { top: "varf", heart: "mijloc", base: "baza" },
};

const found = {};
const blocks = catalog.split(/\n### /).slice(1);
for (const block of blocks) {
  const [head, ...rest] = block.split("\n");
  const m = head.match(/^(\d+)\.\s+(.+)$/);
  if (!m || Number(m[1]) > 22) continue;
  const name = strip(m[2]);
  const scent =
    scents.find((s) => s.name === name) ??
    scents.find((s) => s.key.split("-").every((part) => name.includes(part.slice(0, 4))));
  if (!scent) {
    console.error("no key for", head);
    continue;
  }
  const en = rest.find((l) => l.includes("Notes (EN):"))?.split("Notes (EN):")[1];
  const ro = rest.find((l) => l.includes("Notes (RO):"))?.split("Notes (RO):")[1];
  if (!en || !ro) {
    console.error("no notes for", head);
    continue;
  }
  found[scent.key] = { en: splitNotes(en), ro: splitNotes(ro) };
}

for (const locale of ["en", "ro"]) {
  const path = resolve(site, `messages/${locale}.json`);
  const messages = JSON.parse(readFileSync(path, "utf8"));
  const details = messages.scentDetails ?? {};
  for (const [key, notes] of Object.entries(found)) {
    const src = notes[locale];
    const layer = LAYERS[locale];
    const pyramid = {
      top: src[layer.top] ?? [],
      heart: src[layer.heart] ?? [],
      base: src[layer.base] ?? [],
    };
    if (Object.values(pyramid).some((l) => l.length === 0)) {
      console.error(locale, key, "missing a layer", Object.keys(src));
    }
    details[key] = { ...(details[key] ?? {}), notes: pyramid };
  }
  messages.scentDetails = details;
  writeFileSync(path, JSON.stringify(messages, null, 2) + "\n");
  console.log(locale, Object.keys(details).length, "scents with notes");
}
