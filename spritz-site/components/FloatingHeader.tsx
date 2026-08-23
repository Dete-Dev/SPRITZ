import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import LanguageToggle from "./LanguageToggle";
import CartButton from "./cart/CartButton";
import HeaderSearch from "./nav/HeaderSearch";
import MegaMenu from "./nav/MegaMenu";
import AboutMenu from "./nav/AboutMenu";

/**
 * The SPRITZ toolbar — one big floating pill carrying the whole header.
 *
 * Layout: the PERFUMES mega menu and the bundle shortcuts on the left, the
 * wordmark dead-centre, search, ABOUT, bag and locale on the right.
 *
 * It is a pill, not a full-bleed bar: it floats clear of the page edges with
 * the house's 2px ink border and hard shadow, so the toolbar reads as SPRITZ
 * rather than as a stock e-commerce header. Because it paints its own paper
 * background, nothing inside needs the `.header-control` dark-flip treatment.
 *
 * Below lg the menu and the bundle shortcuts drop away and the wordmark goes
 * back to the left — the mega menu is a desktop pattern (brief §10) and the
 * footer carries the same links.
 */
export default async function FloatingHeader() {
  const t = await getTranslations("header");
  const tNav = await getTranslations("nav");

  return (
    <header
      aria-label="SPRITZ"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-gutter pt-4 md:pt-6"
    >
      <div className="pointer-events-auto relative flex items-center gap-3 rounded-full border-2 border-ink bg-paper py-2 pl-5 pr-2 shadow-hard md:gap-5 md:pl-7">
        {/* Wordmark — dead centre of the pill on lg+, inline left below that
            (a centred mark would collide with the search box on small rows). */}
        <Link
          href="/"
          aria-label={t("home")}
          className="shrink-0 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
        >
          <span
            aria-hidden
            className="block h-9 w-[4.4rem] bg-ink md:h-10 md:w-[4.9rem]"
            style={{
              WebkitMaskImage: "url('/brand/wordmark-sm.webp')",
              maskImage: "url('/brand/wordmark-sm.webp')",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        </Link>

        {/* lg, not md: below lg the centred wordmark would collide with these. */}
        <div className="hidden items-center gap-5 lg:flex">
          <MegaMenu />
          {/* Red text shortcut to the sets page. */}
          <Link
            href="/sets"
            className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.16em] text-red transition-colors hover:text-ink"
          >
            {tNav("makeADiscoverySet")}
          </Link>
          {/* The red pill — straight into the bundle builder. Header-control
              anatomy (same as CartButton), not the sp-cta family, so it sits
              flush with the other 32px controls. */}
          <Link
            href="/bundle"
            className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border-2 border-ink bg-red px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-all hover:-translate-y-px hover:bg-ink hover:shadow-hard-sm"
          >
            {tNav("makeABundle")}
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-4">
          <HeaderSearch />
          <div className="hidden md:block">
            <AboutMenu />
          </div>
          <CartButton label={t("cart")} />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
