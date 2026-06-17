import Image from "next/image";
import { useTranslations } from "next-intl";
import Reveal from "./Reveal";

/**
 * Sits in the cream-held portion of the page gradient (the gradient stays
 * light through ~80% of the page). Text uses ink tones; the section's
 * distinctive feel comes from the saffron-warm radial glow rather than a
 * dark background.
 */
export default function ReserveSection() {
  const t = useTranslations("reserve");

  return (
    <section
      id="reserve"
      className="relative text-ink py-32 md:py-44 px-8 md:px-14 overflow-hidden"
    >
      {/* Atmospheric saffron-warm glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 60%, rgba(196,90,79,0.12) 0%, rgba(244,237,226,0) 70%)",
        }}
      />

      <div className="mx-auto max-w-6xl grid grid-cols-12 gap-8 md:gap-12 items-center relative">
        <Reveal className="col-span-12 md:col-span-6">
          <p className="text-[11px] uppercase tracking-[0.4em] text-ink/55 mb-6">
            {t("eyebrow")}
          </p>
          <h2 className="font-display text-5xl md:text-7xl leading-[1] mb-8">
            {t("h1")}
            <br />
            {t("h2")}
            <br />
            <em className="italic">{t("h3em")}</em>
          </h2>
          <p className="text-ink/75 leading-relaxed max-w-md mb-10">
            {t("body")}
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md">
            <label className="sr-only" htmlFor="reserve-email">
              Email
            </label>
            <input
              id="reserve-email"
              type="email"
              required
              placeholder={t("emailPlaceholder")}
              className="flex-1 bg-transparent border border-ink/30 px-5 py-4 text-sm placeholder:text-ink/40 focus:outline-none focus:border-amber transition"
            />
            <button
              type="submit"
              className="border border-ink/70 px-8 py-4 text-[11px] uppercase tracking-[0.4em] hover:bg-ink hover:text-ivory transition-colors duration-500"
            >
              {t("submit")}
            </button>
          </form>

          <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-ink/40">
            {t("footnote")}
          </p>
        </Reveal>

        <Reveal delay={120} className="col-span-12 md:col-span-5 md:col-start-8">
          <div className="relative aspect-[1.339/1] w-full">
            <Image
              src="/images/scents/safran/hero.webp"
              alt="SPRITZ — essence de safran et ambre"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-contain"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
