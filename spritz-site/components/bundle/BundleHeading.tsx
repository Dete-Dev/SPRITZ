"use client";

import { useTranslations } from "next-intl";
import { Mark } from "@/components/ui/vandal";
import { useBundle } from "./BundleProvider";

/**
 * The page heading, which has to know what is being built.
 *
 * Free-building, it sells the tiers. Inside a shaped set (catalog spec
 * products 34 and 35) the tier copy is simply false — a discovery trio is
 * three 15ml at one fixed percentage — so the heading says what that set is
 * instead. Client-side because the shape lives in BundleProvider.
 */
export default function BundleHeading() {
  const t = useTranslations("bundle");
  const { shape } = useBundle();

  const headline = shape ? t(`shape.${shape.key}.headline`) : t("headline");
  const intro = shape ? t(`shape.${shape.key}.intro`) : t("intro");

  return (
    <>
      <p className="sp-eyebrow">{shape ? t("shape.eyebrow") : t("eyebrow")}</p>
      <h1 className="sp-display mt-5 text-d-2xl">
        <Mark color="var(--sp-yellow)">{headline}</Mark>
      </h1>
      <p className="mt-6 max-w-xl font-sans text-d-lg text-muted">{intro}</p>
    </>
  );
}
