import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Cta from "@/components/ui/Cta";
import ParallaxImage from "@/components/ParallaxImage";
import { SCENTS } from "@/lib/scents";

/**
 * The journal banner — brief §8. One wide ambient frame right before the
 * footer, with a Read More that opens the blog.
 *
 * The ambient photography the brief calls for does not exist yet, so this
 * runs on a catalogue hero shot until those images land; swapping `src` is
 * the only change needed then.
 */
const AMBIENT_KEY = "lavande-vanille";

export default async function BlogBanner() {
  const t = await getTranslations("blog");
  const scent = SCENTS.find((s) => s.key === AMBIENT_KEY);

  return (
    <section className="bg-paper py-section">
      {/* Full-bleed band: no gutter, no max-width. Side borders and the
          rounded corners come off so the card meets both screen edges; the
          top/bottom rules keep it reading as a distinct block, matching
          UspMarquee and SplitPromo. */}
      <div className="relative overflow-hidden border-y-2 border-ink">
        <div className="relative aspect-[16/10] w-full md:aspect-[21/8]">
          {scent ? (
            <ParallaxImage
              src={scent.hero}
              alt=""
              speed={0.3}
              sizes="100vw"
              className="absolute inset-0"
            />
          ) : null}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-transparent"
          />

          <div className="absolute inset-y-0 left-0 flex max-w-lg flex-col justify-center px-gutter py-7 md:py-12">
            <h2 className="sp-display text-d-xl text-cream md:text-d-2xl">
              {t("headline")}
            </h2>
            <p className="mt-4 font-sans text-base text-cream/85">
              {t("body")}
            </p>
            <div className="mt-7">
              <Cta href="/journal" variant="invert">
                {t("cta")}
              </Cta>
            </div>
          </div>
      </div>
      </div>
    </section>
  );
}
