import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SCENTS } from "@/lib/scents";
import Cta from "@/components/ui/Cta";
import LabelName from "@/components/ui/LabelName";
import { StripeBand } from "@/components/ui/vandal";

/**
 * The last ink-world beat. Opens with the tagline set as a full-width display
 * shout — the design system's signoff move — then the usual link columns.
 * The wordmark auto-inverts to cream via `.wordmark-themed` + the data hook.
 */
export default function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer
      data-header-bg="dark"
      className="sp-surface-ink sp-grain relative py-16 px-8 md:px-14 text-cream"
    >
      <StripeBand
        color="var(--sp-red)"
        height={14}
        className="absolute inset-x-0 top-0"
      />

      <div className="mx-auto max-w-7xl">
        <p className="sp-display mb-14 text-[clamp(3rem,8vw,7rem)]">
          {t("signoff")}
        </p>
      </div>

      <div className="mx-auto max-w-7xl grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-4">
          <Image
            src="/brand/wordmark-sm.webp"
            alt="SPRITZ"
            width={160}
            height={85}
            className="wordmark-themed h-12 w-auto mb-4"
          />
          <p className="max-w-xs font-sans text-sm text-cream/70">
            {t("tagline")}
          </p>
        </div>

        <nav
          aria-label={t("scents")}
          className="col-span-6 md:col-span-2 md:col-start-6"
        >
          <p className="sp-eyebrow mb-4">
            {t("scents")}
          </p>
          {/* Twenty-two names would run past the fold — list a handful and
              send the rest to the shop. */}
          <ul className="space-y-2 text-sm text-cream/80">
            {SCENTS.slice(0, 6).map((scent) => (
              <li key={scent.key} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: scent.stripe }}
                />
                <Link href={`/scents/${scent.key}`} className="hover:text-yellow">
                  <LabelName name={scent.name} noteWords={scent.noteWords} />
                </Link>
              </li>
            ))}
            <li>
              <Link href="/shop" className="hover:text-yellow">
                {t("allScents", { count: SCENTS.length })}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={t("house")} className="col-span-6 md:col-span-2">
          <p className="sp-eyebrow mb-4">
            {t("house")}
          </p>
          <ul className="space-y-2 text-sm text-cream/80">
            <li><Link href="/#story" className="hover:text-yellow">{t("houseLinks.story")}</Link></li>
            <li><Link href="/#five" className="hover:text-yellow">{t("houseLinks.five")}</Link></li>
            <li><Link href="/#craft" className="hover:text-yellow">{t("houseLinks.craft")}</Link></li>
            <li><Link href="/#reserve" className="hover:text-yellow">{t("houseLinks.reserve")}</Link></li>
            <li><Link href="/shop" className="hover:text-yellow">{t("houseLinks.shop")}</Link></li>
          </ul>
        </nav>

        <div className="col-span-12 md:col-span-3 md:col-start-10">
          <p className="sp-eyebrow mb-4">
            {t("correspondence")}
          </p>
          <p className="font-sans text-sm text-cream/80">
            {t("correspondenceBody")}
          </p>
          <form className="mt-4 flex gap-2">
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
      </div>

      <div className="sp-eyebrow mx-auto mt-16 flex max-w-7xl flex-col items-start justify-between gap-4 border-t border-ink-line pt-6 md:flex-row md:items-center">
        <span>{t("copyright")}</span>
        <span>
          <Link href="#" className="hover:text-yellow">{t("terms")}</Link> ·{" "}
          <Link href="#" className="hover:text-yellow">{t("privacy")}</Link>
        </span>
      </div>
    </footer>
  );
}
