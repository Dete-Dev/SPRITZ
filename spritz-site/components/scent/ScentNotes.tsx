import { getTranslations } from "next-intl/server";
import NoteIcon from "@/components/scent/NoteIcon";
import type { Scent } from "@/lib/scents";
import { NOTE_LAYERS } from "@/lib/scents";

/**
 * The technical scent-notes block — brief §13, copied from the reference:
 *
 *   This perfume is: <one line>
 *   Main Notes:   [icon] word   [icon] word
 *   [▲] Top:    The first notes you smell — a, b, c
 *   [◎] Middle: The heart of the perfume — d, e
 *   [▼] Base:   The notes that linger all day — f, g
 *
 * Pyramids live in messages → scentDetails.<key>.notes, written for all 22
 * by scripts/ingest-notes.mjs from docs/catalog.md.
 */
const LAYER_GLYPH = { top: "top", heart: "middle", base: "base" } as const;

export default async function ScentNotes({ scent }: { scent: Scent }) {
  const t = await getTranslations("scentPage");
  const tFive = await getTranslations("five");
  const tNotes = await getTranslations(`scentDetails.${scent.key}`);
  const hasPyramid = tNotes.has("notes.top");

  return (
    <div className="font-sans">
      <p className="inline-block rounded-full bg-paper-2 px-3 py-1.5 text-[13px] text-ink">
        <span className="font-bold">{t("thisPerfumeIs")}</span>{" "}
        {tFive(`shortNotes.${scent.key}`)}
      </p>

      <div className="mt-5">
        <p className="text-[13px] font-bold">{t("mainNotes")}</p>
        <ul className="mt-3 flex flex-wrap gap-5">
          {scent.noteWords.map((note) => (
            <li key={note} className="flex w-16 flex-col items-center gap-1.5 text-center">
              <NoteIcon note={note} className="h-10 w-10 text-ink" />
              <span className="text-[11px] capitalize leading-tight text-ink">
                {note}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {hasPyramid ? (
        <ul className="mt-6 space-y-4 border-t border-line pt-5">
          {NOTE_LAYERS.map((layer) => (
            <li key={layer} className="flex items-start gap-3">
              <NoteIcon glyph={LAYER_GLYPH[layer]} className="mt-0.5 h-5 w-5 shrink-0 text-ink" />
              <p className="text-[13px] leading-relaxed text-muted">
                <span className="font-bold text-ink">{t(`noteLayers.${layer}`)}:</span>{" "}
                {t(`noteLayerDescriptions.${layer}`)}
                <br />
                <span className="text-ink">
                  {(tNotes.raw(`notes.${layer}`) as string[]).join(", ")}
                </span>
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
