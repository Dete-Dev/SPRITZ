"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import FilterDropdown from "@/components/shop/FilterDropdown";
import ScentCard from "@/components/ui/ScentCard";
import {
  BESTSELLER_KEYS,
  NEW_ARRIVAL_KEYS,
  SCENTS,
  savingPercent,
  type ScentFamily,
  type ScentGender,
} from "@/lib/scents";
import { enterStagger } from "@/lib/motion";

/**
 * The shop — brief §11.
 *
 * Filters stay URL state (`/shop?family=fresh&gender=him&edit=bestsellers`)
 * so a filtered view is shareable and the homepage tiles can deep-link into
 * it. Search and sort are local: they are a way of reading the same set, not
 * a place anyone links to.
 *
 * Every filter change re-runs the anime.js stagger so the grid visibly
 * re-deals.
 */
const FAMILIES: ScentFamily[] = ["fresh", "floral", "warm", "sweet"];
const GENDERS: ScentGender[] = ["her", "him", "unisex"];
const EDITS = ["bestsellers", "new"] as const;
const SORTS = ["featured", "saving", "name"] as const;

type Sort = (typeof SORTS)[number];

/** Copy stickers, keyed by scent — same two as the home grid. */
const BADGES: Record<string, string> = {
  "safran-ambre": "bestseller",
  "truffe-chocolat": "new",
};

/** Where the promo tile is dealt into the grid (0-based, after N products). */
const PROMO_AFTER = 4;

/** Diacritic-insensitive haystack prep ("âme" matches "ame"). */
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function ShopGrid({
  promoCard,
}: {
  /** Rendered on the server and dealt into the grid — brief §11. */
  promoCard?: React.ReactNode;
}) {
  const t = useTranslations("shop");
  const tFive = useTranslations("five");
  const tCommon = useTranslations("common");
  const tFamilies = useTranslations("families");
  const tNav = useTranslations("shopNav");
  const tFilters = useTranslations("shopFilters");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const gridRef = useRef<HTMLUListElement | null>(null);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("featured");

  const rawFamily = searchParams.get("family");
  const rawGender = searchParams.get("gender");
  const rawEdit = searchParams.get("edit");
  const family = FAMILIES.find((f) => f === rawFamily) ?? null;
  const gender = GENDERS.find((g) => g === rawGender) ?? null;
  const edit = EDITS.find((e) => e === rawEdit) ?? null;

  function setFilter(key: "family" | "gender" | "edit", value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }

  const visible = useMemo(() => {
    const nq = norm(query.trim());
    const editKeys =
      edit === "bestsellers"
        ? BESTSELLER_KEYS
        : edit === "new"
          ? NEW_ARRIVAL_KEYS
          : null;

    const list = SCENTS.filter(
      (s) =>
        (!family || s.family === family) &&
        (!gender || s.gender === gender) &&
        (!editKeys || editKeys.includes(s.key)) &&
        (nq.length < 2 ||
          norm(s.name).includes(nq) ||
          norm(s.inspiredBy).includes(nq)),
    );

    if (sort === "saving") {
      return [...list].sort((a, b) => savingPercent(b) - savingPercent(a));
    }
    if (sort === "name") {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    /* "featured" keeps the curated edit order where one applies, otherwise
       catalogue order. */
    if (editKeys) {
      return [...list].sort(
        (a, b) => editKeys.indexOf(a.key) - editKeys.indexOf(b.key),
      );
    }
    return list;
  }, [family, gender, edit, query, sort]);

  /* The promo tile only earns its place in a full grid; on a short filtered
     result it would crowd out the products. */
  const showPromo = Boolean(promoCard) && visible.length > PROMO_AFTER + 2;

  // Re-deal the grid whenever the visible set changes (and on first paint).
  const dealKey = visible.map((s) => s.key).join("|");
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    enterStagger(grid.querySelectorAll(":scope > li"));
  }, [dealKey]);

  return (
    <>
      {/* Search + sort on the left, quick filters on the right (brief §11). */}
      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="flex min-w-[14rem] flex-1 items-center gap-2 rounded-full border-2 border-ink bg-paper px-5 py-2 shadow-hard-sm lg:max-w-sm">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tFilters("searchPlaceholder")}
              aria-label={tFilters("searchLabel")}
              className="min-w-0 flex-1 bg-transparent font-sans text-sm text-ink outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
            />
          </div>

          <FilterDropdown
            label={tFilters("sort")}
            value={sort === "featured" ? null : sort}
            onChange={(v) => setSort((v as Sort) ?? "featured")}
            clearLabel={tFilters("clear")}
            options={SORTS.filter((s) => s !== "featured").map((s) => ({
              value: s,
              label: tFilters(`sorts.${s}`),
            }))}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown
            label={tFilters("gender")}
            value={gender}
            onChange={(v) => setFilter("gender", v)}
            clearLabel={tFilters("clear")}
            options={GENDERS.map((g) => ({
              value: g,
              label: t(`genders.${g}`),
            }))}
          />
          <FilterDropdown
            label={tFilters("family")}
            value={family}
            onChange={(v) => setFilter("family", v)}
            clearLabel={tFilters("clear")}
            options={FAMILIES.map((f) => ({
              value: f,
              label: tFamilies(`names.${f}`),
            }))}
          />
          <FilterDropdown
            label={tFilters("collections")}
            value={edit}
            onChange={(v) => setFilter("edit", v)}
            clearLabel={tFilters("clear")}
            options={EDITS.map((e) => ({ value: e, label: tNav(e) }))}
          />
          <span className="ml-1 font-sans text-xs font-bold uppercase tracking-[0.1em] text-muted">
            {t("count", { count: visible.length })}
          </span>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-16 font-sans text-base text-muted">
          {tFilters("empty")}
        </p>
      ) : (
        <ul
          ref={gridRef}
          className="mt-10 grid grid-cols-2 items-stretch gap-5 sm:grid-cols-3 lg:grid-cols-4"
        >
          {visible.map((scent, idx) => (
            <Fragment key={scent.key}>
              {/* Brief §11 — a taller, differently-dressed tile dealt in among
                  the products to sell the set. */}
              {idx === PROMO_AFTER && showPromo ? (
                <li className="sp-pre-enter col-span-2 sm:col-span-1 sm:row-span-2">
                  {promoCard}
                </li>
              ) : null}

              <li className="sp-pre-enter flex">
                <ScentCard
                  scent={scent}
                  priceLabel={tCommon("price", { price: scent.price })}
                  inspiredByLabel={tCommon("inspiredBy", {
                    name: scent.inspiredBy,
                  })}
                  fragranticaLabel={tFilters("fragrantica", {
                    name: scent.inspiredBy,
                  })}
                  genderLabel={t(`genders.${scent.gender}`)}
                  /* Below €20 the flex reads as an anti-flex — skip it. */
                  savingsLabel={
                    scent.retailPrice - scent.price >= 20
                      ? tCommon("cheaperPercent", {
                          percent: savingPercent(scent),
                        })
                      : undefined
                  }
                  note={tFive(`shortNotes.${scent.key}`)}
                  badge={BADGES[scent.key]}
                  priority={idx < 3}
                />
              </li>
            </Fragment>
          ))}
        </ul>
      )}
    </>
  );
}
