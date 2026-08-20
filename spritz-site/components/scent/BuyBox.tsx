import { getTranslations } from "next-intl/server";
import type { Scent } from "@/lib/scents";
import PurchaseOptions from "@/components/scent/PurchaseOptions";
import AddToBundleButton from "@/components/bundle/AddToBundleButton";
import LabelName from "@/components/ui/LabelName";
import { Sticker } from "@/components/ui/vandal";

interface BuyBoxProps {
  scent: Scent;
}

/**
 * Sticky-on-desktop product buy box.
 *
 * Primary CTA is Add to Bag — wires the scent's `shopifyVariantId` into the
 * cart context. When the variant id is empty (Shopify store not set up
 * yet), the button label switches to "Store launching soon" and click is a
 * no-op. Filling in `shopifyVariantId` in lib/scents.ts is enough to make
 * the button live — no other code change required.
 */
export default async function BuyBox({ scent }: BuyBoxProps) {
  const t = await getTranslations("scentPage");
  const tCommon = await getTranslations("common");

  const bullets = t.raw("bullets") as string[];
  const priceFormatted = String(scent.price);

  return (
    <div className="md:sticky md:top-28">
      <p className="sp-eyebrow mb-5">
        {tCommon("inspiredBy", { name: scent.inspiredBy })}
      </p>

      {/* The name is set exactly as printed on the bottle: lowercase French,
          note words bold (rule 7). */}
      <h1 className="sp-display mb-7 text-[clamp(2.2rem,4vw,4rem)] lowercase">
        <LabelName name={scent.name} noteWords={scent.noteWords} />
      </h1>

      <Sticker tilt={-4} variant="fill" fill={scent.stripe}>
        {scent.size} · eau de parfum
      </Sticker>

      {/* Price + size row */}
      <div className="mb-8 mt-8 flex items-end gap-10 border-t-2 border-ink pt-6">
        <div>
          <p className="sp-eyebrow mb-2">{t("priceLabel")}</p>
          <p className="font-sans text-3xl font-bold">
            {priceFormatted}{" "}
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

      {/* One-time vs subscription + Add to Bag. Renders just the CTA until
          a subscription app publishes selling plans for this variant. */}
      <PurchaseOptions
        variantId={scent.shopifyVariantId}
        price={scent.price}
        className="max-w-md"
      />

      {/* Secondary CTA — start/extend a discounted bundle without leaving
          the product page. Surfaces the persistent bundle bar. */}
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
