import { useTranslations } from "next-intl";
import ParallaxImage from "./ParallaxImage";
import Reveal from "./Reveal";
import { Mark, Spray, Sticker, StripeBand } from "@/components/ui/vandal";

const STEP_KEYS = ["compose", "batch", "send"] as const;

/**
 * How it's made — the second ink-world beat. The three steps are numbered
 * with stickers instead of roman numerals, and each step is ruled off with
 * the label stripe in a different colourway so the list reads as three
 * labels rather than three paragraphs.
 */
const STEP_STRIPES = [
  "var(--sp-yellow)",
  "var(--sp-pink)",
  "var(--sp-green)",
] as const;

export default function CraftSection() {
  const t = useTranslations("craft");

  return (
    <section
      id="craft"
      data-header-bg="dark"
      className="sp-surface-ink sp-grain relative overflow-hidden px-gutter py-section"
    >
      <Spray
        color="var(--sp-green)"
        opacity={0.3}
        className="absolute -right-24 top-1/4 h-[28rem] w-[28rem]"
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-12 gap-10 md:gap-16">
        <div className="col-span-12 md:col-span-5">
          <div className="md:sticky md:top-28">
            <Reveal>
              <div className="-rotate-2">
                <ParallaxImage
                  src="/images/scents/ananas/clean.webp"
                  alt="SPRITZ — voile d'ananas et bouleau"
                  speed={0.12}
                  className="aspect-[4/5] rounded-card border-2 border-cream bg-paper"
                  imageClassName="object-contain"
                />
              </div>
              <p className="sp-eyebrow mt-6">{t("caption")}</p>
            </Reveal>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <Reveal className="mb-14">
            <p className="sp-eyebrow">{t("eyebrow")}</p>
            <h2 className="sp-display mt-5 text-d-2xl">
              {t("headline")}{" "}
              <Mark color="var(--sp-green)">{t("headlineEm")}</Mark>
            </h2>
          </Reveal>

          <ol className="space-y-10">
            {STEP_KEYS.map((step, idx) => (
              <Reveal key={step} delay={idx * 100} as="li">
                <StripeBand color={STEP_STRIPES[idx]} height={10} thin />
                <div className="pt-7">
                  <Sticker tilt={idx % 2 === 0 ? -4 : 3} variant="fill" fill={STEP_STRIPES[idx]}>
                    {`0${idx + 1}`}
                  </Sticker>
                  <h3 className="sp-display mt-5 text-d-xl">
                    {t(`steps.${step}.title`)}
                  </h3>
                  <p className="mt-3 max-w-md font-sans text-base text-cream/75">
                    {t(`steps.${step}.body`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
