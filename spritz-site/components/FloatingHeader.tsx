import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import LanguageToggle from "./LanguageToggle";
import CartButton from "./cart/CartButton";

/**
 * SPRITZ floating header (server component).
 *
 * Locked layout (memory: spritz-header-layout):
 * - NO horizontal bar / banner.
 * - Right side: language toggle + Shop button.
 *
 * The wordmark is rendered by <JumpingWordmark/> as a separate client
 * component (it has its own fixed positioning + scroll-driven motion).
 * The middle grid slot here is intentionally empty so the page layout
 * stays consistent across routes; the jumping wordmark visually fills it
 * at scroll = 0.
 */
export default async function FloatingHeader() {
  const t = await getTranslations("header");

  return (
    <header
      aria-label="SPRITZ"
      className="pointer-events-none fixed inset-x-0 top-0 z-40"
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 pt-6 md:px-12 md:pt-8">
        <span aria-hidden className="block" />

        {/* Wordmark slot — filled by <JumpingWordmark/> rendered separately.
            Reserves height so the right-side controls align vertically. */}
        <span aria-hidden className="block h-10 md:h-12" />

        <div className="flex items-center justify-end gap-3 md:gap-4">
          <LanguageToggle />
          <Link
            href="/shop"
            className="pointer-events-auto hidden sm:inline-flex items-center gap-2 rounded-full border bg-ivory/40 px-5 py-2 text-[11px] uppercase tracking-[0.32em] text-ink backdrop-blur-sm transition-colors hover:bg-ink hover:text-ivory"
            style={{ borderColor: "rgba(26,20,17,0.25)" }}
          >
            {t("shop")}
          </Link>
          <CartButton label={t("cart")} />
        </div>
      </div>
    </header>
  );
}
