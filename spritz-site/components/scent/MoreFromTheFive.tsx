import { getTranslations } from "next-intl/server";
import ScentCard from "@/components/ui/ScentCard";
import { SCENTS } from "@/lib/scents";

/**
 * The closing shelf on a product page — four more from the catalogue. Same
 * <ScentCard/> as every other grid, so a scent looks identical wherever it
 * appears.
 */
export default async function MoreFromTheFive({
  excludeKey,
}: {
  excludeKey: string;
}) {
  const t = await getTranslations("scentPage");
  const tFive = await getTranslations("five");
  const tCommon = await getTranslations("common");
  // 21 cards would be a second shop page. Show a row of four and let the
  // shop link carry the rest.
  const others = SCENTS.filter((s) => s.key !== excludeKey).slice(0, 4);

  return (
    <section
      aria-labelledby="more-heading"
      className="border-t-2 border-ink bg-paper px-gutter py-section"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h2 id="more-heading" className="sp-display text-d-xl">
            {t("moreTitle")}
          </h2>
          <p className="mt-3 max-w-md font-sans text-base text-muted">
            {t("moreSubtitle")}
          </p>
        </div>

        <ul className="grid grid-cols-2 items-stretch gap-5 lg:grid-cols-4">
          {others.map((scent) => (
            <li key={scent.key}>
              <ScentCard
                scent={scent}
                priceLabel={tCommon("price", { price: scent.price })}
                inspiredByLabel={tCommon("inspiredBy", { name: scent.inspiredBy })}
                note={tFive(`shortNotes.${scent.key}`)}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
