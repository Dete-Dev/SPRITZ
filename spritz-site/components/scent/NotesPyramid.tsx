import { getTranslations } from "next-intl/server";
import { NOTE_LAYERS, type NoteLayer } from "@/lib/scents";
import { StripeBand } from "@/components/ui/vandal";

/**
 * Three-column notes pyramid: Top / Heart / Base.
 * Reads ingredient lists from messages under `scentDetails.{key}.notes.{layer}`.
 * Layer label and description come from `scentPage.noteLayers` and
 * `scentPage.noteLayerDescriptions`.
 */
/** Top / heart / base each get a distinct stripe so the three read apart. */
const LAYER_STRIPES = [
  "var(--sp-yellow)",
  "var(--sp-pink)",
  "var(--sp-blue)",
] as const;

export default async function NotesPyramid({ scentKey }: { scentKey: string }) {
  const t = await getTranslations("scentPage");
  const tDetails = await getTranslations(`scentDetails.${scentKey}.notes`);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {NOTE_LAYERS.map((layer: NoteLayer, idx) => {
        const ingredients = tDetails.raw(layer) as string[];
        return (
          <div
            key={layer}
            className="overflow-hidden rounded-card border-2 border-ink bg-paper shadow-hard-sm"
          >
            <StripeBand color={LAYER_STRIPES[idx]} height={12} />
            <div className="p-8">
              <p className="sp-eyebrow mb-3">
                {String(idx + 1).padStart(2, "0")} — {t(`noteLayers.${layer}`)}
              </p>
              <p className="mb-8 max-w-xs font-sans text-sm text-muted">
                {t(`noteLayerDescriptions.${layer}`)}
              </p>
              <ul className="space-y-3">
                {ingredients.map((ingredient) => (
                  <li
                    key={ingredient}
                    className="border-b border-line pb-3 last:border-b-0 last:pb-0"
                  >
                    <p className="sp-display text-2xl lowercase">
                      {ingredient}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
