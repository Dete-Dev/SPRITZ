import { getTranslations } from "next-intl/server";
import type { Scent } from "@/lib/scents";
import SizeSelector from "@/components/scent/SizeSelector";
import AddToBundleButton from "@/components/bundle/AddToBundleButton";
import LabelName from "@/components/ui/LabelName";
import { Sticker } from "@/components/ui/vandal";

interface BuyBoxProps {
  scent: Scent;
}

/**
 * Sticky-on-desktop product buy box — brief §13.
 *
 * Order follows the brief: name, then "inspired by X (retail price Y)" —
 * the whole dupe pitch in one line — then our price with the saving against
 * the original, then the pack selector, then the trust bullets.
 *
 * The Add-to-bag button lives inside <SizeSelector/>, because which CTA
 * belongs there depends on which pack is chosen. It goes live the moment
 * `shopifyVariantId` is filled in on lib/scents.ts; no other change needed.
 */
export default async function BuyBox({ scent }: BuyBoxProps) {
  const t = await getTranslations("scentPage");
  const tCommon = await getTranslations("common");

  const bullets = t.raw("bullets") as string[];
  const saving = scent.retailPrice - scent.price;

  return (
    <div className="md:sticky md:top-28">
      {/* The name is set exactly as printed on the bottle: lowercase French,
          note words bold (rule 7). */}
      <h1 className="sp-display mb-5 text-[clamp(2.2rem,4vw,4rem)] lowercase">
        <LabelName name={scent.name} noteWords={scent.noteWords} />
      </h1>

      {/* Brief §13 — inspired-by plus the original's retail price is the
          essential line; without the comparison the price means nothing. */}
      <p className="font-sans text-sm text-muted">
        {tCommon("inspiredBy", { name: scent.inspiredBy })}{" "}
        <span className="text-ink">
          {t("retailPrice", { price: scent.retailPrice })}
        </span>
      </p>

      <div className="mt-6">
        <Sticker tilt={-4} variant="fill" fill={scent.stripe}>
          {scent.size} · eau de parfum
        </Sticker>
      </div>

      {/* Price + saving */}
      <div className="mb-8 mt-8 border-t-2 border-ink pt-6">
        <div className="flex items-end gap-10">
          <div>
            <p className="sp-eyebrow mb-2">{t("priceLabel")}</p>
            <p className="font-sans text-3xl font-bold">
              {scent.price}{" "}
              <span className="text-base font-normal text-muted">
                {t("currency")}
              </span>
            </p>
          </div>
          <div>
            <p className="sp-eyebrow mb-2">{t("sizeLabel")}</p>
            <p className="font-sans text-3xl font-bold">
              {scent.size}{" "}
              <span className="text-base font-normal text-muted">
                {t("edpLabel")}
              </span>
            </p>
          </div>
        </div>

        {/* Below €20 the flex reads as an anti-flex — skip the line. */}
        {saving >= 20 ? (
          <p className="mt-4 inline-block bg-ink px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-paper">
            {tCommon("cheaperThan", { amount: saving })}
          </p>
        ) : null}
      </div>

      {/* Pack selector + the matching CTA (brief §13/§15). */}
      <SizeSelector scent={scent} />

      {/* Secondary CTA — extend a bigger set without leaving the page. */}
      <div className="mt-3 max-w-md">
        <AddToBundleButton scentKey={scent.key} />
      </div>

      {/* Trust bullets */}
      <ul className="mt-10 space-y-3">
        {bullets.map((line, i) => (
          <li
            key={i}
            className="flex items-start gap-3 font-sans text-[13px] leading-relaxed text-muted"
          >
            <span aria-hidden className="mt-px font-bold text-green">
              ✓
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
