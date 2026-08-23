import { useTranslations } from "next-intl";
import CountUp from "@/components/motion/CountUp";

/** The three confidence stats from the brief's reference block. */
const STATS = ["value", "lasting", "recommend"] as const;

/**
 * Social proof — brief §9, the band that sits right above the FAQ. One big
 * number on the left, three survey stats on the right.
 *
 * The percentage rings are pure CSS conic-gradient — no chart library for
 * three static numbers. The rings stay still and only the figures count up:
 * animating a conic-gradient is a repaint every frame, and two effects on one
 * element buy nothing.
 *
 * Every figure here is a real surveyed number with the source in `footnote`.
 */
export default function SocialProof() {
  const t = useTranslations("proof");

  return (
    <section className="bg-paper-2 px-gutter py-section">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
        <h2 className="sp-display text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[0.95]">
          {t("headline")}
        </h2>

        <ul className="divide-y-2 divide-ink/10">
          {STATS.map((key) => (
            <li key={key} className="flex items-center gap-5 py-5">
              <span
                aria-hidden
                className="grid h-14 w-14 shrink-0 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(var(--sp-red) ${t(`${key}.percent`)}%, var(--sp-line) 0)`,
                }}
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-paper-2 font-sans text-xs font-bold text-ink">
                  <CountUp to={Number(t(`${key}.percent`))} />%
                </span>
              </span>
              <p className="font-sans text-sm text-muted md:text-base">
                {t(`${key}.label`)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <p className="mx-auto mt-8 max-w-6xl font-sans text-xs text-muted">
        {t("footnote")}
      </p>
    </section>
  );
}
