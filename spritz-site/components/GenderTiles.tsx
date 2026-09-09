import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SCENTS, type ScentGender } from "@/lib/scents";

/**
 * Women / Men / Unisex — brief §4, with the client's override: the three
 * tiles fill one whole screen edge to edge, so no card border, radius, gap or
 * shadow is visible. Each tile deep-links into the shop with the gender
 * pre-filtered and carries the arrow-in-a-white-circle button from the
 * reference.
 *
 * On hover the clean shot crossfades to the same bottles out on the street.
 * Both layers are plain <Image/> under the `group`, so the swap is CSS and
 * this stays a server component.
 */
/** Which hover register the page runs. Flip to "vandal" to swap all of them. */
const LOOK = "street";

const TILES: { gender: ScentGender; slug: string }[] = [
  { gender: "her", slug: "gender-her" },
  { gender: "him", slug: "gender-him" },
  { gender: "unisex", slug: "gender-unisex" },
];

export default async function GenderTiles() {
  const t = await getTranslations("shop");

  return (
    <section className="h-svh min-h-[40rem] bg-paper-2">
      {/* One viewport, three columns on md+, three rows below. No gap, no
          gutter — the photos meet each other and the screen edge. */}
      <ul className="grid h-full grid-rows-3 md:grid-cols-3 md:grid-rows-1">
        {TILES.map(({ gender, slug }) => {
          const count = SCENTS.filter((s) => s.gender === gender).length;

          return (
            <li key={gender} className="min-h-0">
              <Link
                href={`/shop?gender=${gender}`}
                className="group relative block h-full overflow-hidden"
              >
                <Image
                  src={`/images/editorial/${slug}.webp`}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-[transform,opacity] duration-[900ms] ease-spritz group-hover:scale-[1.05] group-hover:opacity-0"
                />
                <Image
                  src={`/images/editorial/${slug}-${LOOK}.webp`}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="absolute inset-0 object-cover opacity-0 transition-[transform,opacity] duration-[900ms] ease-spritz group-hover:scale-[1.05] group-hover:opacity-100"
                />

                <span className="absolute left-5 top-5 md:left-7 md:top-7">
                  <span className="sp-display block text-[clamp(1.75rem,3.2vw,2.8rem)] uppercase text-ink">
                    {t(`genders.${gender}`)}
                  </span>
                  <span className="mt-1 block font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-ink/70">
                    {t("count", { count })}
                  </span>
                </span>

                {/* The arrow-in-a-white-circle from the reference. */}
                <span
                  aria-hidden
                  className="absolute bottom-5 right-5 inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-paper text-lg leading-none text-ink shadow-hard-sm transition-transform duration-200 ease-spritz group-hover:translate-x-1 md:bottom-7 md:right-7"
                >
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
