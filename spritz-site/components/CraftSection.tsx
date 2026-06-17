import { useTranslations } from "next-intl";
import ParallaxImage from "./ParallaxImage";
import Reveal from "./Reveal";

const STEP_KEYS = ["compose", "batch", "send"] as const;
const ROMAN = ["I", "II", "III"];

export default function CraftSection() {
  const t = useTranslations("craft");

  return (
    <section
      id="craft"
      className="relative py-32 md:py-44 px-8 md:px-14 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl grid grid-cols-12 gap-8 md:gap-16">
        <div className="col-span-12 md:col-span-5">
          <div className="md:sticky md:top-24">
            <Reveal>
              <ParallaxImage
                src="/images/scents/ananas/clean.webp"
                alt="SPRITZ — voile d'ananas et bouleau"
                speed={0.12}
                className="aspect-[4/5]"
                imageClassName="object-contain"
              />
              <p className="mt-6 text-[11px] uppercase tracking-[0.4em] text-ink/55">
                {t("caption")}
              </p>
            </Reveal>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <Reveal className="mb-16">
            <p className="text-[11px] uppercase tracking-[0.4em] text-ink/55 mb-6">
              {t("eyebrow")}
            </p>
            <h2 className="font-display text-5xl md:text-6xl leading-[1.02]">
              {t("headline")}
              <br />
              <em className="italic">{t("headlineEm")}</em>
            </h2>
          </Reveal>

          <ol className="space-y-12">
            {STEP_KEYS.map((step, idx) => (
              <Reveal key={step} delay={idx * 100} as="li">
                <div className="flex gap-8 items-start border-t border-ink/15 pt-8">
                  <span className="font-display text-3xl italic text-amber shrink-0 w-10">
                    {ROMAN[idx]}
                  </span>
                  <div>
                    <h3 className="font-display text-3xl mb-3">
                      {t(`steps.${step}.title`)}
                    </h3>
                    <p className="text-ink/70 leading-relaxed max-w-md">
                      {t(`steps.${step}.body`)}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
