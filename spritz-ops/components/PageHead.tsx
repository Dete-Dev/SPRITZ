import Reveal from "@/components/Reveal";
import { Sticker } from "@/components/ui/vandal";

/** The masthead of every ops screen. One sticker, no more. */
export default function PageHead({
  eyebrow, title, note,
}: {
  eyebrow: string;
  title: string;
  note?: string;
}) {
  return (
    <Reveal>
      <div className="relative">
        <p className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.4em] text-muted">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-serif text-d-lg font-black leading-[0.95]">{title}</h1>
        {note && (
          <Sticker tilt={-3} variant="fill" fill="var(--sp-yellow)" className="absolute right-0 top-0 hidden sm:inline-flex">
            {note}
          </Sticker>
        )}
      </div>
    </Reveal>
  );
}
