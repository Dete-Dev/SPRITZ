"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * "Back to top" — brief §9. Discreet circle in the bottom-right of the
 * footer, appears once the visitor is a screen or so down the page.
 *
 * Uses window.scrollTo rather than a hash link so Lenis animates it.
 */
export default function BackToTop() {
  const t = useTranslations("footer");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t("backToTop")}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-cream text-lg leading-none text-cream transition-colors hover:bg-cream hover:text-ink"
    >
      ↑
    </button>
  );
}
