"use client";

import { useTranslations } from "next-intl";
import Cta from "@/components/ui/Cta";
import { useBundle } from "./BundleProvider";

interface AddToBundleButtonProps {
  /** Scent key of the product page this button lives on. */
  scentKey: string;
  className?: string;
}

/**
 * Secondary CTA on a scent page — drops the current scent into the shared
 * bundle and surfaces the persistent bottom bar. The bar follows the
 * visitor as they browse other scents, so they can build a discounted set
 * without leaving the product pages.
 */
export default function AddToBundleButton({
  scentKey,
  className,
}: AddToBundleButtonProps) {
  const t = useTranslations("bundle");
  const { addScent, slots } = useBundle();
  const countOfThis = slots.filter((k) => k === scentKey).length;

  return (
    <Cta
      variant="ghost"
      block
      onClick={() => addScent(scentKey)}
      className={className}
    >
      {t("addToBundle")}
      {countOfThis > 0 ? <span>· {countOfThis}</span> : null}
    </Cta>
  );
}
