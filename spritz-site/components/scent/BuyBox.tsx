import { getTranslations } from "next-intl/server";
import type { Scent } from "@/lib/scents";
import PurchaseOptions from "@/components/scent/PurchaseOptions";
import AddToBundleButton from "@/components/bundle/AddToBundleButton";

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
  const tHero = await getTranslations("hero.scents");
  const tStory = await getTranslations(`scentDetails.${scent.key}`);

  const bullets = t.raw("bullets") as string[];
  const priceFormatted = new Intl.NumberFormat("ro-RO").format(scent.price);

  return (
    <div className="md:sticky md:top-28">
      <p className="text-[11px] uppercase tracking-[0.4em] text-ink/55 mb-5">
        {tHero(`${scent.key}.eyebrow`)}
      </p>

      <h1 className="font-display text-[clamp(2.4rem,4.4vw,4.4rem)] leading-[0.96] whitespace-pre-line mb-7">
        {scent.nameDisplay}
      </h1>

      <p className="text-ink/75 leading-relaxed mb-10 max-w-md">
        {tStory("story1")}
      </p>

      {/* Price + size row */}
      <div className="flex items-end gap-10 mb-8 border-t border-ink/15 pt-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink/55 mb-2">
            {t("priceLabel")}
          </p>
          <p className="font-display text-3xl text-ink">
            {priceFormatted}{" "}
            <span className="text-base text-ink/55">{t("currency")}</span>
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink/55 mb-2">
            {t("sizeLabel")}
          </p>
          <p className="font-display text-3xl text-ink">
            {scent.size}{" "}
            <span className="text-base text-ink/55">{t("edpLabel")}</span>
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
            className="flex items-start gap-3 text-[13px] text-ink/65 leading-relaxed"
          >
            <span
              aria-hidden
              className="mt-[7px] inline-block h-1 w-1 rounded-full bg-ink/40"
            />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
