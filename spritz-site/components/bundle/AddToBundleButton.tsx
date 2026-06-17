"use client";

import { useTranslations } from "next-intl";
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
    <button
      type="button"
      onClick={() => addScent(scentKey)}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/40 bg-transparent px-7 py-3 text-[11px] uppercase tracking-[0.32em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-ivory ${className ?? ""}`}
    >
      {t("addToBundle")}
      {countOfThis > 0 && (
        <span className="text-ink/45">· {countOfThis}</span>
      )}
    </button>
  );
}
