import { useTranslations } from "next-intl";
import ParallaxImage from "./ParallaxImage";
import Reveal from "./Reveal";

export default function StorySection() {
  const t = useTranslations("story");
  return (
    <section
      id="story"
      className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-8 md:px-14 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl grid grid-cols-12 gap-8 md:gap-12 items-center">
        <Reveal className="col-span-12 md:col-span-5 md:col-start-2">
          <p className="text-[11px] uppercase tracking-[0.4em] text-ink/55 mb-6">
            {t("eyebrow")}
          </p>
          <h2 className="font-display text-5xl md:text-6xl leading-[1.02] mb-8">
            {t("headline")}
            <br />
            <em className="italic">{t("headlineEm")}</em>
          </h2>
          <p className="text-ink/75 leading-relaxed mb-5 max-w-md">{t("p1")}</p>
          <p className="text-ink/75 leading-relaxed max-w-md">{t("p2")}</p>
        </Reveal>

        <Reveal
          delay={150}
          className="col-span-12 md:col-span-5 md:col-start-8"
        >
          <ParallaxImage
            src="/images/scents/menthe/clean.webp"
            alt="SPRITZ — bois de cèdre et menthe"
            speed={0.18}
            className="aspect-[4/5]"
            imageClassName="object-contain"
          />
        </Reveal>
      </div>
    </section>
  );
}
