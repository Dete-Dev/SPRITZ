import { useTranslations } from "next-intl";
import VelocityBand from "@/components/motion/VelocityBand";

/** The four brand promises, repeated forever. Copy lives under `usps`. */
const USPS = ["ingredients", "pricing", "lasting", "variety"] as const;

/**
 * Brand-benefit marquee — brief §5. Same infinite CSS track as the
 * "inspired by" band, but on paper with a red separator so the two never
 * read as the same strip.
 */
export default function UspMarquee() {
  const t = useTranslations("usps");

  const track = (clone: boolean) => (
    <div className="sp-ticker__track" aria-hidden={clone || undefined}>
      {USPS.map((key) => (
        <span
          key={key}
          className="flex items-center whitespace-nowrap font-sans text-sm font-bold uppercase tracking-[0.14em] text-ink"
        >
          <span className="px-5 text-red">✦</span>
          <span>{t(key)}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="border-y-2 border-ink bg-yellow py-3">
      <div className="sp-ticker">
        <VelocityBand direction={-1}>
          {track(false)}
          {track(true)}
          {track(true)}
        </VelocityBand>
      </div>
    </div>
  );
}
