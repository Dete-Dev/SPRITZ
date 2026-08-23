"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

/**
 * The horizontal category row under the header — brief §11.
 *
 * The brief lists Duo Set / Discovery Set / Gift Set as separate categories.
 * SPRITZ sells one size and builds every set in the bundle configurator, so
 * those three collapse into one honest entry that goes there; the rest are
 * real views of the catalogue driven by the `edit` URL param.
 */
const EDITS = ["bestsellers", "new"] as const;

export default function ShopSubmenu() {
  const t = useTranslations("shopNav");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const active = searchParams.get("edit");

  const item =
    "shrink-0 whitespace-nowrap border-b-2 pb-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em] transition-colors";

  /** Keep every other filter when switching view. */
  function hrefFor(edit: string | null): string {
    const params = new URLSearchParams(searchParams.toString());
    if (edit) params.set("edit", edit);
    else params.delete("edit");
    const q = params.toString();
    return `${pathname}${q ? `?${q}` : ""}`;
  }

  return (
    <nav
      aria-label={t("label")}
      className="sp-rail -mx-1 flex gap-7 overflow-x-auto border-b-2 border-ink px-1"
    >
      <Link
        href={hrefFor(null)}
        className={`${item} ${!active ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"}`}
      >
        {t("all")}
      </Link>

      {EDITS.map((edit) => (
        <Link
          key={edit}
          href={hrefFor(edit)}
          className={`${item} ${active === edit ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"}`}
        >
          {t(edit)}
        </Link>
      ))}

      {/* Sets live on their own page — custom offers plus ready-made ones. */}
      <Link
        href="/sets"
        className={`${item} border-transparent text-red hover:text-ink`}
      >
        {t("sets")}
      </Link>
    </nav>
  );
}
