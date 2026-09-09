"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import NavMenu from "./NavMenu";

/**
 * The ABOUT menu — brief §16. Two columns, exactly the reference:
 * WHO WE ARE → About Us, Refer a Friend · HELP → Contact Us, FAQ.
 */
const COLUMNS = [
  {
    key: "whoWeAre",
    links: [
      { key: "aboutUs", href: "/about" },
      { key: "referFriend", href: "/refer" },
    ],
  },
  {
    key: "help",
    links: [
      { key: "contact", href: "/contact" },
      { key: "faq", href: "/faq" },
    ],
  },
] as const;

export default function AboutMenu() {
  const t = useTranslations("nav");

  const group = "font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-muted";
  const item =
    "block py-1.5 font-sans text-sm text-ink transition-colors hover:text-red";

  return (
    <NavMenu label={t("about")} align="right" panelClassName="w-[min(26rem,88vw)]">
      <div className="grid grid-cols-2 gap-8 p-6">
        {COLUMNS.map((col) => (
          <div key={col.key}>
            <p className={group}>{t(col.key)}</p>
            <ul className="mt-3">
              {col.links.map((l) => (
                <li key={l.key}>
                  <Link href={l.href} className={item}>
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </NavMenu>
  );
}
