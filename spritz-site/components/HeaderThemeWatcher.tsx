"use client";

import { useEffect } from "react";

/**
 * Watches the page for elements marked `data-header-bg="dark"` and toggles
 * a `.header-on-dark` class on `<html>` whenever one of them intersects the
 * top band of the viewport (where the floating header / wordmark sits).
 *
 * The wordmark images (in <HeroWordmark/> and <FloatingHeader/>) react via
 * CSS — see globals.css `.wordmark-themed` — flipping from black graffiti
 * to warm cream when over a dark section.
 *
 * Mounted once in the root layout. No props, no DOM output.
 */
export default function HeaderThemeWatcher() {
  useEffect(() => {
    // Re-query on each mount — sections may have rendered after first paint.
    const els = document.querySelectorAll<HTMLElement>(
      '[data-header-bg="dark"]',
    );
    if (els.length === 0) return;

    const root = document.documentElement;
    let inDarkCount = 0;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inDarkCount += 1;
          else inDarkCount -= 1;
        }
        inDarkCount = Math.max(0, inDarkCount);
        root.classList.toggle("header-on-dark", inDarkCount > 0);
      },
      {
        // Only count intersection within the top ~10vh of the viewport,
        // i.e. where the floating header lives. Shrink the bottom of the
        // root by 90% of viewport height.
        rootMargin: "0px 0px -90% 0px",
        threshold: 0,
      },
    );

    els.forEach((el) => obs.observe(el));

    return () => {
      obs.disconnect();
      root.classList.remove("header-on-dark");
    };
  }, []);

  return null;
}
