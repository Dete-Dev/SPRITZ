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

    // Track WHICH sections are under the header, not how many events fired.
    // A counter breaks as soon as there are two dark sections: the observer's
    // initial callback reports every observed element, so the one off-screen
    // decrements away the one that is actually under the header.
    const inDark = new Set<Element>();

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inDark.add(entry.target);
          else inDark.delete(entry.target);
        }
        root.classList.toggle("header-on-dark", inDark.size > 0);
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
