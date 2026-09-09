import { useTranslations } from "next-intl";
import Reveal from "./Reveal";
import Cta from "@/components/ui/Cta";
import ScentCard from "@/components/ui/ScentCard";
import { Mark, Sticker } from "@/components/ui/vandal";
import { SCENTS } from "@/lib/scents";

/** The home page shows a shelf, not the whole catalogue — /shop has all 22. */
const HOME_COUNT = 10;

/** Copy stickers, keyed by scent. Only two — the kit caps the noise. */
const BADGES: Record<string, string> = {
  "safran-ambre": "bestseller",
  "truffe-chocolat": "new",
};

/**
 * "The Five" — the product index, and the paper world's opening statement.
 * One <ScentCard/> per scent, each wearing its own stripe colourway, so the
 * row reads as five labels on a shelf rather than five identical tiles.
 */
export default function FragranceSection() {
  const t = useTranslations("five");
  const tCommon = useTranslations("common");

  return (
    <section
      id="five"
      className="relative overflow-hidden bg-paper px-gutter py-section"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-14 max-w-2xl md:mb-20">
          <p className="sp-eyebrow">{t("eyebrow")}</p>
          <h2 className="sp-display mt-5 text-d-2xl">
            {t("headline")}{" "}
            <Mark color="var(--sp-yellow)">{t("headlineEm")}</Mark>
          </h2>
          <p className="mt-6 max-w-md font-sans text-d-lg text-muted">
            {t("intro")}
          </p>
          <div className="mt-6">
            <Sticker tilt={-4} variant="ink" fill="var(--sp-red)">
              {tCommon("allUnder")}
            </Sticker>
          </div>
        </Reveal>

        <ul className="grid grid-cols-2 items-stretch gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {SCENTS.slice(0, HOME_COUNT).map((scent, idx) => (
            <Reveal key={scent.key} delay={idx * 80} as="li">
              <ScentCard
                scent={scent}
                priceLabel={tCommon("price", { price: scent.price })}
                inspiredByLabel={tCommon("inspiredBy", { name: scent.inspiredBy })}
                /* Below €20 the flex reads as an anti-flex — skip the banner. */
                savingsLabel={
                  scent.retailPrice - scent.price >= 20
                    ? tCommon("cheaperThan", {
                        amount: scent.retailPrice - scent.price,
                      })
                    : undefined
                }
                note={t(`shortNotes.${scent.key}`)}
                badge={BADGES[scent.key]}
              />
            </Reveal>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <Cta href="/shop" variant="primary">
            {t("seeAll", { count: SCENTS.length })}
          </Cta>
        </div>
      </div>
    </section>
  );
}
