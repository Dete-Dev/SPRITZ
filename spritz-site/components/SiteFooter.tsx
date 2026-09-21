import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SCENTS } from "@/lib/scents";
import Cta from "@/components/ui/Cta";
import BackToTop from "@/components/BackToTop";

/**
 * The footer — brief §9.
 *
 * The wordmark sits centred in the middle with the two link groups balanced
 * either side of it (About Us on the left, Information on the right), the
 * newsletter underneath, and a discreet back-to-top in the bottom-right.
 * The old red promo band above the footer is gone, as the brief asks.
 *
 * The wordmark auto-inverts to cream via `.wordmark-themed` + the data hook.
 */
export default function SiteFooter() {
  const t = useTranslations("footer");

  const link = "font-sans text-sm text-cream/75 transition-colors hover:text-yellow";

  return (
    <footer
      data-header-bg="dark"
      className="sp-surface-ink sp-grain relative px-8 py-16 text-cream md:px-14"
    >
      <div className="mx-auto max-w-7xl">
        <p className="sp-display mb-16 text-[clamp(3rem,8vw,7rem)]">
          {t("signoff")}
        </p>

        {/* Three balanced columns with the wordmark holding the middle. */}
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          <nav aria-label={t("house")}>
            <p className="sp-eyebrow mb-5">{t("house")}</p>
            <ul className="space-y-2.5">
              <li><Link href="/shop" className={link}>{t("houseLinks.shop")}</Link></li>
              <li><Link href="/sets" className={link}>{t("houseLinks.sets")}</Link></li>
              <li><Link href="/bundle" className={link}>{t("houseLinks.bundle")}</Link></li>
              <li><Link href="/about" className={link}>{t("houseLinks.about")}</Link></li>
              <li><Link href="/refer" className={link}>{t("houseLinks.refer")}</Link></li>
              <li><Link href="/journal" className={link}>{t("houseLinks.journal")}</Link></li>
            </ul>
          </nav>

          <div className="flex flex-col items-center justify-start gap-5 text-center">
            <Image
              src="/brand/wordmark-sm.webp"
              alt="SPRITZ"
              width={160}
              height={85}
              className="wordmark-themed h-14 w-auto"
            />
            <p className="max-w-xs font-sans text-sm text-cream/70">
              {t("tagline")}
            </p>
          </div>

          <nav aria-label={t("information")} className="md:text-right">
            <p className="sp-eyebrow mb-5">{t("information")}</p>
            <ul className="space-y-2.5">
              <li><Link href="/faq" className={link}>{t("infoLinks.faq")}</Link></li>
              <li><Link href="/contact" className={link}>{t("infoLinks.contact")}</Link></li>
              <li><Link href="/faq#shipping" className={link}>{t("infoLinks.shipping")}</Link></li>
              <li><Link href="#" className={link}>{t("terms")}</Link></li>
              <li><Link href="#" className={link}>{t("privacy")}</Link></li>
              <li>
                <Link href="/shop" className={link}>
                  {t("allScents", { count: SCENTS.length })}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Correspondence, centred under the wordmark column. */}
        <div className="mx-auto mt-16 max-w-md text-center">
          <p className="sp-eyebrow mb-4">{t("correspondence")}</p>
          <p className="font-sans text-sm text-cream/75">
            {t("correspondenceBody")}
          </p>
          <form className="mt-5 flex gap-2">
            <label htmlFor="footer-email" className="sr-only">Email</label>
            <input
              id="footer-email"
              type="email"
              placeholder={t("emailPlaceholder")}
              className="min-w-0 flex-1 rounded-full border-2 border-cream bg-transparent px-4 py-2 font-sans text-sm placeholder:text-cream/40 focus:outline-none"
            />
            <Cta type="submit" variant="invert" size="sm">
              {t("join")}
            </Cta>
          </form>
        </div>

        <div className="sp-eyebrow mt-16 flex items-center justify-between gap-4 border-t border-ink-line pt-6">
          <span>{t("copyright")}</span>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
