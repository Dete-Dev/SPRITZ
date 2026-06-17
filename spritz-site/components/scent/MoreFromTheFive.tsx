import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SCENTS } from "@/lib/scents";

/**
 * "The other four" — at the bottom of a scent product page, surfaces the
 * remaining scents (excluding the current one) as a 4-card grid.
 */
export default async function MoreFromTheFive({
  excludeKey,
}: {
  excludeKey: string;
}) {
  const t = await getTranslations("scentPage");
  const tHero = await getTranslations("hero.scents");
  const others = SCENTS.filter((s) => s.key !== excludeKey);

  return (
    <section
      aria-labelledby="more-heading"
      className="bg-ivory border-t border-ink/10 px-8 md:px-14 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14">
          <h2
            id="more-heading"
            className="font-display text-4xl md:text-5xl leading-[1.02] mb-3"
          >
            {t("moreTitle")}
          </h2>
          <p className="text-ink/65 leading-relaxed max-w-md">
            {t("moreSubtitle")}
          </p>
        </div>

        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
          {others.map((scent) => (
            <li key={scent.key} className="group">
              <Link
                href={`/scents/${scent.key}`}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                aria-label={scent.name}
              >
                <div className="relative aspect-[4/5] mb-5">
                  <Image
                    src={scent.clean}
                    alt={scent.name}
                    fill
                    sizes="(min-width: 1024px) 22vw, 50vw"
                    className="object-contain transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: scent.accent }}
                  />
                </div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-ink/55 mb-2">
                  {tHero(`${scent.key}.eyebrow`)}
                </p>
                <h3 className="font-display text-xl leading-tight max-w-[14ch]">
                  {scent.name}
                </h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
