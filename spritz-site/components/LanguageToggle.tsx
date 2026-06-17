"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * RO / EN switch. Uses the locale-aware <Link> from i18n/navigation, which
 * preserves the current pathname when switching locales (so /scents/ananas in
 * RO becomes /en/scents/ananas in EN, and vice versa).
 */
export default function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("languageToggle");

  return (
    <div
      className="pointer-events-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.32em]"
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((l, i) => {
        const isActive = l === locale;
        return (
          <span key={l} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden className="text-ink/30">/</span>}
            <Link
              href={pathname}
              locale={l}
              aria-label={t("switchTo", { locale: l.toUpperCase() })}
              aria-current={isActive ? "true" : undefined}
              className={
                isActive
                  ? "text-ink"
                  : "text-ink/40 hover:text-ink transition-colors"
              }
            >
              {t(l)}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
