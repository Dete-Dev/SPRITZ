import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Cta from "@/components/ui/Cta";
import Image from "next/image";

/**
 * The journal banner — brief §8. One wide ambient frame right before the
 * footer, with a Read More that opens the blog.
 *
 * Shot 16:9 with the bottles in the right third and the left half left empty,
 * because the headline and the ink scrim sit over that half.
 */
/** Which hover register the page runs. Flip to "vandal" to swap the banner. */
const LOOK = "street";

const AMBIENT = "/images/editorial/journal-banner.webp";
const AMBIENT_HOVER = `/images/editorial/journal-banner-${LOOK}.webp`;

export default async function BlogBanner() {
  const t = await getTranslations("blog");

  return (
    <section className="bg-paper py-6">
      {/* Full-bleed band: no gutter, no max-width. Side borders and the
          rounded corners come off so the card meets both screen edges; the
          top/bottom rules keep it reading as a distinct block, matching
          UspMarquee and SplitPromo. */}
      <div className="relative overflow-hidden border-y-2 border-ink">
        <div className="group relative aspect-[16/10] w-full md:aspect-[21/8]">
          <Image
            src={AMBIENT}
            alt=""
            fill
            sizes="100vw"
            className="object-cover transition-opacity duration-[900ms] ease-spritz group-hover:opacity-0"
          />
          <Image
            src={AMBIENT_HOVER}
            alt=""
            fill
            sizes="100vw"
            className="absolute inset-0 object-cover opacity-0 transition-opacity duration-[900ms] ease-spritz group-hover:opacity-100"
          />
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
