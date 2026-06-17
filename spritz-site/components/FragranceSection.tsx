import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Reveal from "./Reveal";
import { SCENTS } from "@/lib/scents";

/**
 * "The Five" — product index. One card per scent.
 * All copy locale-aware; scent product names stay as-is (printed on bottles).
 */
export default function FragranceSection() {
  const t = useTranslations("five");
  const tHero = useTranslations("hero.scents");

  return (
    <section
      id="five"
      className="relative py-32 md:py-40 px-8 md:px-14 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-20 md:mb-24 max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.4em] text-ink/55 mb-6">
            {t("eyebrow")}
          </p>
          <h2 className="font-display text-5xl md:text-6xl leading-[1.02]">
            {t("headline")}
            <br />
            <em className="italic">{t("headlineEm")}</em>
          </h2>
          <p className="mt-6 text-ink/70 leading-relaxed max-w-md">
            {t("intro")}
          </p>
        </Reveal>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-4">
          {SCENTS.map((scent, idx) => (
            <Reveal key={scent.key} delay={idx * 90} as="li" className="group">
              <Link
                href={`/scents/${scent.key}`}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                aria-label={scent.name}
              >
                <div className="relative aspect-[4/5] mb-5">
                  <Image
                    src={scent.clean}
                    alt={scent.name}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: scent.accent }}
                  />
                </div>

                <p className="text-[10px] uppercase tracking-[0.4em] text-ink/55 mb-2">
                  {tHero(`${scent.key}.eyebrow`)}
                </p>
                <h3 className="font-display text-2xl leading-tight mb-2 max-w-[14ch]">
                  {scent.name}
                </h3>
                <p className="text-sm text-ink/65 leading-relaxed">
                  {t(`shortNotes.${scent.key}`)}
                </p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
