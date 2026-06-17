import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SCENTS } from "@/lib/scents";

/**
 * Footer sits at the bottom of the page-wide gradient where the background
 * has fully darkened to ink. Wordmark is auto-inverted via `.wordmark-themed`
 * + a small data hook below; all other text uses ivory tones for contrast.
 */
export default function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer
      data-header-bg="dark"
      className="py-16 px-8 md:px-14 text-ivory"
    >
      <div className="mx-auto max-w-7xl grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-4">
          <Image
            src="/brand/wordmark-sm.webp"
            alt="SPRITZ"
            width={160}
            height={85}
            className="wordmark-themed h-12 w-auto mb-4"
          />
          <p className="text-sm text-ivory/70 max-w-xs leading-relaxed">
            {t("tagline")}
          </p>
        </div>

        <nav
          aria-label={t("scents")}
          className="col-span-6 md:col-span-2 md:col-start-6"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/50 mb-4">
            {t("scents")}
          </p>
          <ul className="space-y-2 text-sm text-ivory/80">
            {SCENTS.map((scent) => (
              <li key={scent.key}>
                <Link
                  href={`/scents/${scent.key}`}
                  className="hover:text-ivory capitalize"
                >
                  {scent.key}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("house")} className="col-span-6 md:col-span-2">
          <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/50 mb-4">
            {t("house")}
          </p>
          <ul className="space-y-2 text-sm text-ivory/80">
            <li><Link href="/#story" className="hover:text-ivory">{t("houseLinks.story")}</Link></li>
            <li><Link href="/#five" className="hover:text-ivory">{t("houseLinks.five")}</Link></li>
            <li><Link href="/#craft" className="hover:text-ivory">{t("houseLinks.craft")}</Link></li>
            <li><Link href="/#reserve" className="hover:text-ivory">{t("houseLinks.reserve")}</Link></li>
            <li><Link href="/shop" className="hover:text-ivory">{t("houseLinks.shop")}</Link></li>
          </ul>
        </nav>

        <div className="col-span-12 md:col-span-3 md:col-start-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/50 mb-4">
            {t("correspondence")}
          </p>
          <p className="text-sm text-ivory/80 leading-relaxed">
            {t("correspondenceBody")}
          </p>
          <form className="mt-4 flex gap-2">
            <label htmlFor="footer-email" className="sr-only">Email</label>
            <input
              id="footer-email"
              type="email"
              placeholder={t("emailPlaceholder")}
              className="flex-1 bg-transparent border border-ivory/30 px-3 py-2 text-sm placeholder:text-ivory/40 focus:outline-none focus:border-ivory transition"
            />
            <button
              type="submit"
              className="border border-ivory/50 px-3 py-2 text-[10px] uppercase tracking-[0.3em] hover:bg-ivory hover:text-ink transition-colors duration-500"
            >
              {t("join")}
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl mt-16 pt-6 border-t border-ivory/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[10px] uppercase tracking-[0.35em] text-ivory/50">
        <span>{t("copyright")}</span>
        <span>
          <Link href="#" className="hover:text-ivory">{t("terms")}</Link> ·{" "}
          <Link href="#" className="hover:text-ivory">{t("privacy")}</Link>
        </span>
      </div>
    </footer>
  );
}
