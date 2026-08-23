"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import NavMenu from "./NavMenu";

/**
 * The ABOUT menu — brief §16. Two columns, WHO WE ARE and HELP, exactly the
 * shape of the reference.
 *
 * "Refer a friend" from the reference has no destination on this site yet, so
 * it is left out rather than shipped as a dead link; the columns carry the
 * pages that exist instead.
 */
export default function AboutMenu() {
  const t = useTranslations("nav");

  const group = "font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-muted";
  const item =
    "block py-1.5 font-sans text-sm text-ink transition-colors hover:text-red";

  return (
    <NavMenu label={t("about")} align="right" panelClassName="w-[min(26rem,88vw)]">
      <div className="grid grid-cols-2 gap-8 p-6">
        <div>
          <p className={group}>{t("whoWeAre")}</p>
          <ul className="mt-3">
            <li>
              <Link href="/#story" className={item}>
                {t("aboutUs")}
              </Link>
            </li>
            <li>
              <Link href="/#craft" className={item}>
                {t("craft")}
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
          <p className={group}>{t("help")}</p>
          <ul className="mt-3">
            <li>
              <Link href="/#faq" className={item}>
                {t("faq")}
              </Link>
            </li>
            <li>
              <Link href="/#reserve" className={item}>
                {t("contact")}
              </Link>
            </li>
            <li>
              <Link href="/#faq" className={item}>
                {t("shipping")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </NavMenu>
  );
}
