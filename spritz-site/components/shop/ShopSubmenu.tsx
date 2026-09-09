"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

/**
 * The horizontal category row under the header — brief §11, in exactly the
 * brief's order: All Perfumes · Duo Set · Discovery Set · Gift Set ·
 * Bestsellers.
 *
 * All / Bestsellers are views of this catalogue (the `edit` URL param). The
 * three set entries go to the gift-sets page: Duo Set is the custom 50ml+15ml
 * offer, Discovery Set is the 3×15ml trio (catalog §35 names it that), Gift
 * Set is the whole page.
 */
const SET_LINKS = [
  { key: "duo", href: "/sets#duo" },
  { key: "discovery", href: "/sets#trio" },
  { key: "gift", href: "/sets" },
] as const;

export default function ShopSubmenu() {
  const t = useTranslations("shopNav");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const active = searchParams.get("edit");

  const item =
    "shrink-0 whitespace-nowrap border-b-2 pb-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em] transition-colors";
  const idle = "border-transparent text-muted hover:text-ink";
  const on = "border-ink text-ink";

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
      <Link href={hrefFor(null)} className={`${item} ${!active ? on : idle}`}>
        {t("all")}
      </Link>

      {SET_LINKS.map(({ key, href }) => (
        <Link key={key} href={href} className={`${item} ${idle}`}>
          {t(key)}
        </Link>
      ))}

      <Link
        href={hrefFor("bestsellers")}
        className={`${item} ${active === "bestsellers" ? on : idle}`}
      >
        {t("bestsellers")}
      </Link>
    </nav>
  );
}
