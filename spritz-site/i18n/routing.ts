import { defineRouting } from "next-intl/routing";

/**
 * Locale routing config.
 *
 * - `ro` is the default and lives at `/` (no prefix), because the brand is
 *   Romanian-made and that's the primary audience.
 * - `en` lives at `/en/...`.
 *
 * Flip the default by swapping `defaultLocale` and reordering `locales`.
 */
export const routing = defineRouting({
  locales: ["ro", "en"],
  defaultLocale: "ro",
  localePrefix: "as-needed",
});
