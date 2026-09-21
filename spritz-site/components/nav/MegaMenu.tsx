"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import NavMenu from "./NavMenu";
import { StripeBand } from "@/components/ui/vandal";
import { SCENTS, type ScentFamily, type ScentGender } from "@/lib/scents";

/**
 * The PERFUMES mega menu — brief §10.
 *
 * Left: the big "shop all" tile, kept from the reference. Then the groups the
 * brief asks for: GIFT SET (the duo and trio offers, which is what the old
 * Impressions/Originals become), SHOP BY GENDER, THE EDITS, and the optional
 * scent-family shortcuts.
 *
 * Every entry points at something that exists — the gender and edit links are
 * the shop's own URL filters, the set links deep-link into /sets.
 */
const GENDERS: ScentGender[] = ["her", "him", "unisex"];
const FAMILIES: ScentFamily[] = ["fresh", "floral", "warm", "sweet"];

/** The bottle on the "shop all" tile. */
const HERO_KEY = "safran-ambre";

export default function MegaMenu() {
  const t = useTranslations("nav");
  const tShop = useTranslations("shop");
  const tNav = useTranslations("shopNav");
  const tFamilies = useTranslations("families");

  const hero = SCENTS.find((s) => s.key === HERO_KEY);

  const group = "font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-muted";
  const item =
    "block py-1.5 font-sans text-sm text-ink transition-colors hover:text-red";

  return (
    <NavMenu
      label={t("perfumes")}
      panelClassName="w-[min(58rem,90vw)]"
    >
      <div className="grid gap-8 p-6 md:grid-cols-[13rem_1fr] md:p-8">
        {/* Shop all — the big tile. */}
        <Link
          href="/shop"
          className="sp-lift group flex flex-col overflow-hidden rounded-card border-2 border-ink bg-paper-2 shadow-hard-sm"
        >
          <div className="relative aspect-[1/1.1] w-full">
            {hero ? (
              <Image
                src={hero.clean}
                alt=""
                fill
                sizes="208px"
                className="object-contain p-3 transition-transform duration-700 ease-spritz group-hover:scale-105"
              />
            ) : null}
          </div>
          <StripeBand color="var(--sp-red)" height={10} />
          <span className="px-4 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.14em]">
            {t("shopAll")}
          </span>
        </Link>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* GIFT SET — what Impressions / Originals became. */}
          <div>
            <p className={group}>{t("giftSet")}</p>
            <ul className="mt-3">
              <li>
                <Link href="/sets#duo" className={item}>
                  {t("duoSet")}
                </Link>
              </li>
              <li>
                <Link href="/sets#trio" className={item}>
                  {t("trioSet")}
                </Link>
              </li>
              <li>
                <Link href="/sets" className={item}>
                  {t("allSets")}
                </Link>
              </li>
              <li>
                <Link href="/bundle" className={item}>
                  {t("makeABundle")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className={group}>{t("byGender")}</p>
            <ul className="mt-3">
              {GENDERS.map((g) => (
                <li key={g}>
                  <Link href={`/shop?gender=${g}`} className={item}>
                    {tShop(`genders.${g}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={group}>{t("edits")}</p>
            <ul className="mt-3">
              <li>
                <Link href="/shop?edit=bestsellers" className={item}>
                  {tNav("bestsellers")}
                </Link>
              </li>
              <li>
                <Link href="/shop?edit=new" className={item}>
                  {tNav("new")}
                </Link>
              </li>
              <li>
                <Link href="/journal" className={item}>
                  {t("journal")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className={group}>{t("families")}</p>
            <ul className="mt-3">
              {FAMILIES.map((f) => (
                <li key={f}>
                  <Link href={`/shop?family=${f}`} className={item}>
                    {tFamilies(`names.${f}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </NavMenu>
  );
}
