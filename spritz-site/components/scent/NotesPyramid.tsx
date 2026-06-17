import { getTranslations } from "next-intl/server";
import { NOTE_LAYERS, type NoteLayer } from "@/lib/scents";

/**
 * Three-column notes pyramid: Top / Heart / Base.
 * Reads ingredient lists from messages under `scentDetails.{key}.notes.{layer}`.
 * Layer label and description come from `scentPage.noteLayers` and
 * `scentPage.noteLayerDescriptions`.
 */
export default async function NotesPyramid({ scentKey }: { scentKey: string }) {
  const t = await getTranslations("scentPage");
  const tDetails = await getTranslations(`scentDetails.${scentKey}.notes`);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink/10">
      {NOTE_LAYERS.map((layer: NoteLayer, idx) => {
        const ingredients = tDetails.raw(layer) as string[];
        return (
          <div key={layer} className="bg-bone p-10 md:p-12">
            <p className="text-[11px] uppercase tracking-[0.4em] text-ink/55 mb-3">
              {String(idx + 1).padStart(2, "0")} — {t(`noteLayers.${layer}`)}
            </p>
            <p className="text-sm text-ink/55 leading-relaxed mb-8 max-w-xs">
              {t(`noteLayerDescriptions.${layer}`)}
            </p>
            <ul className="space-y-4">
              {ingredients.map((ingredient) => (
                <li
                  key={ingredient}
                  className="border-b border-ink/10 pb-3 last:border-b-0 last:pb-0"
                >
                  <p className="font-display text-2xl leading-tight">
                    {ingredient}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
