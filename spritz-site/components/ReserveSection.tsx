import Image from "next/image";
import { useTranslations } from "next-intl";
import Reveal from "./Reveal";
import Cta from "@/components/ui/Cta";
import { Mark, Sticker, StripeBand, Tape } from "@/components/ui/vandal";

/**
 * Edition-01 sign-up. Paper world: the form lives inside a bordered, hard-
 * shadowed card banded top and bottom by the red stripe, so it reads as a
 * slip pasted onto the page. The bottle is taped in beside it.
 */
export default function ReserveSection() {
  const t = useTranslations("reserve");

  return (
    <section
      id="reserve"
      className="relative overflow-hidden bg-paper px-gutter py-section"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-12 items-center gap-10 md:gap-14">
        <Reveal className="col-span-12 md:col-span-7">
          <div className="overflow-hidden rounded-card border-2 border-ink bg-paper shadow-hard">
            <StripeBand color="var(--sp-red)" height={14} />

            <div className="px-6 py-10 md:px-10">
              <p className="sp-eyebrow">{t("eyebrow")}</p>
              <h2 className="sp-display mt-5 text-d-2xl">
                {t("h1")} {t("h2")}{" "}
                <Mark color="var(--sp-red)">{t("h3em")}</Mark>
              </h2>
              <p className="mt-6 max-w-md font-sans text-base text-muted">
                {t("body")}
              </p>

              <form className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="reserve-email">
                  Email
                </label>
                <input
                  id="reserve-email"
                  type="email"
                  required
                  placeholder={t("emailPlaceholder")}
                  className="flex-1 rounded-full border-2 border-ink bg-paper px-5 py-3 font-sans text-base placeholder:text-muted focus:outline-none focus-visible:outline-none"
                />
                <Cta type="submit" variant="primary">
                  {t("submit")}
                </Cta>
              </form>

              <p className="sp-eyebrow mt-6">{t("footnote")}</p>
            </div>

            <StripeBand color="var(--sp-red)" height={14} />
          </div>
        </Reveal>

        <Reveal delay={120} className="col-span-12 md:col-span-4 md:col-start-9">
          <div className="relative rotate-[3deg]">
            <Tape rotate={-5} className="absolute -top-4 left-1/2 z-10 -ml-14" />
            <div className="relative aspect-[2/3] w-full rounded-card border-2 border-ink bg-paper">
              <Image
                src="/images/scents/safran-ambre/hero.webp"
                alt="SPRITZ — essence de safran et ambre"
                fill
                sizes="(min-width: 768px) 34vw, 100vw"
                className="object-contain"
              />
            </div>
            <div className="absolute -bottom-4 -left-3">
              <Sticker tilt={-6} variant="fill" fill="var(--sp-yellow)">
                edition 01
              </Sticker>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
