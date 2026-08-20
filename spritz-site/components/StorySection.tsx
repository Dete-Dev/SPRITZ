import { useTranslations } from "next-intl";
import ParallaxImage from "./ParallaxImage";
import Reveal from "./Reveal";
import { Mark, Spray, Tape } from "@/components/ui/vandal";

/**
 * The brand story — the first ink-world beat after the shop-white bundle
 * builder. Editorial layout: smashed display headline with one marker swipe,
 * body left, product taped to the page on the right with a scrawled caption.
 * Three vandal elements exactly (spray, tape, scrawl) — the per-viewport cap.
 */
export default function StorySection() {
  const t = useTranslations("story");

  return (
    <section
      id="story"
      data-header-bg="dark"
      className="sp-surface-ink sp-grain relative overflow-hidden px-gutter py-section"
    >
      <Spray
        color="var(--sp-blue)"
        opacity={0.35}
        className="absolute -left-32 top-10 h-[32rem] w-[32rem]"
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-12 items-center gap-10 md:gap-16">
        <Reveal className="col-span-12 md:col-span-6">
          <p className="sp-eyebrow">{t("eyebrow")}</p>
          <h2 className="sp-display mt-5 text-d-2xl">
            {t("headline")}
            <br />
            <Mark color="var(--sp-blue)">{t("headlineEm")}</Mark>
          </h2>
          <p className="mt-8 max-w-md font-sans text-d-lg text-cream/80">
            {t("p1")}
          </p>
          <p className="mt-4 max-w-md font-sans text-base text-cream/70">
            {t("p2")}
          </p>
        </Reveal>

        <Reveal delay={150} className="col-span-12 md:col-span-5 md:col-start-8">
          <div className="relative rotate-[2.5deg]">
            <Tape
              rotate={-4}
              className="absolute -top-4 left-1/2 z-10 -ml-14"
            />
            <ParallaxImage
              src="/images/scents/cedre-menthe/clean.webp"
              alt="SPRITZ — bois de cèdre et menthe"
              speed={0.18}
              className="aspect-[4/5] rounded-card border-2 border-cream bg-paper"
              imageClassName="object-contain"
            />
            <span className="sp-scrawl absolute -bottom-5 right-0 -rotate-[4deg] text-yellow">
              {t("caption")}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
