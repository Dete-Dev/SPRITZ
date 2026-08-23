import { Link } from "@/i18n/navigation";
import { SCENTS } from "@/lib/scents";
import VelocityBand from "@/components/motion/VelocityBand";

/**
 * The "inspired by" shout band — brief §2. Sits immediately under the hero,
 * runs right-to-left non-stop (pure CSS marquee, see .sp-ticker in
 * globals.css), and every designer name is a link to the SPRITZ scent that
 * answers to it.
 *
 * The duplicate track that makes the loop seamless is aria-hidden, so screen
 * readers and the tab order only ever meet each name once.
 */
export default function InspiredByTicker({
  leadWord,
}: {
  /** Localised "inspired by" prefix, repeated between names. */
  leadWord: string;
}) {
  const track = (clone: boolean) => (
    <div className="sp-ticker__track" aria-hidden={clone || undefined}>
      {SCENTS.map((scent) => (
        <Link
          key={scent.key}
          href={`/scents/${scent.key}`}
          tabIndex={clone ? -1 : undefined}
          className="flex items-center whitespace-nowrap font-sans text-sm font-bold uppercase tracking-[0.14em] text-paper transition-colors hover:text-yellow"
        >
          <span className="px-4 text-red">{leadWord}</span>
          <span>{scent.inspiredBy}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="border-y-2 border-ink bg-ink py-3">
      <div className="sp-ticker">
        <VelocityBand direction={1}>
          {track(false)}
          {track(true)}
        </VelocityBand>
      </div>
    </div>
  );
}
