import { getTranslations } from "next-intl/server";
import NotesPyramid from "@/components/scent/NotesPyramid";
import { Sticker } from "@/components/ui/vandal";
import type { Scent } from "@/lib/scents";

/**
 * The technical scent-notes block — brief §13.
 *
 * "This perfume is" one-liner, the main notes as stickers in the scent's own
 * colourway, then the Top / Heart / Base breakdown.
 *
 * Only five of the twenty-two have a written pyramid (scentDetails.<key>.notes).
 * For the rest this states the two notes the label actually prints and says
 * the pyramid is still being written — inventing seventeen note pyramids for a
 * real fragrance house is not ours to do.
 */
export default async function ScentNotes({ scent }: { scent: Scent }) {
  const t = await getTranslations("scentPage");
  const tFive = await getTranslations("five");

  return (
    <div>
      <p className="font-sans text-base text-ink">
        <span className="sp-eyebrow mr-2">{t("thisPerfumeIs")}</span>
        {tFive(`shortNotes.${scent.key}`)}
      </p>

      <div className="mt-6">
        <p className="sp-eyebrow mb-3">{t("mainNotes")}</p>
        <div className="flex flex-wrap gap-2.5">
          {scent.noteWords.map((note, i) => (
            <Sticker key={note} tilt={i % 2 === 0 ? -4 : 3} variant="fill" fill={scent.stripe}>
              {note}
            </Sticker>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {scent.hasStory ? (
          <NotesPyramid scentKey={scent.key} />
        ) : (
          <p className="rounded-card border-2 border-dashed border-line px-5 py-4 font-sans text-[13px] text-muted">
            {t("notesIntroLabel")}
          </p>
        )}
      </div>
    </div>
  );
}
