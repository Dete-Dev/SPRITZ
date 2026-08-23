import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { StripeBand } from "@/components/ui/vandal";
import ClipReveal from "@/components/motion/ClipReveal";
import { SCENTS, type ScentGender } from "@/lib/scents";

/**
 * Women / Men / Unisex — brief §4. Three big rounded tiles that deep-link
 * into the shop with the gender pre-filtered, each with the arrow-in-a-circle
 * button the reference uses.
 *
 * SPRITZ shoots bottles, not models, so each tile wears the hero shot of a
 * representative scent instead of a portrait — same rule FamilyTiles follows.
 */
const TILES: { gender: ScentGender; scentKey: string }[] = [
  { gender: "her", scentKey: "cerise-rose" },
  { gender: "him", scentKey: "cuir-tabac" },
  { gender: "unisex", scentKey: "oud-santal" },
];

export default async function GenderTiles() {
  const t = await getTranslations("shop");
  const tG = await getTranslations("genderTiles");

  return (
    <section className="bg-paper-2 px-gutter py-section">
      {/* Full-bleed: no max-width cap, so the three tiles span the screen.
          The section's px-gutter is the only margin. */}
      <ClipReveal>
        <ul className="grid gap-5 md:grid-cols-3">
        {TILES.map(({ gender, scentKey }) => {
          const scent = SCENTS.find((s) => s.key === scentKey);
          if (!scent) return null;
          const count = SCENTS.filter((s) => s.gender === gender).length;

          return (
            <li key={gender}>
              <Link
                href={`/shop?gender=${gender}`}
                className="sp-lift group block overflow-hidden rounded-card border-2 border-ink bg-paper shadow-hard"
              >
                {/* Landscape banner on mobile (a 4/5 tile full-width is a screen
                    and a half tall); the portrait tile returns in the 3-col grid.
                    The studio shots are tall bottle portraits on their own
                    near-white ground, so the frame matches that ground and
                    contains the bottle: a cover crop shows the middle of the
                    glass and nothing else, and a coloured frame would leave the
                    shot floating as a white rectangle. The colourway arrives on
                    the stripe band underneath instead. */}
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-paper-2 md:aspect-[4/5] md:max-h-[28rem]">
                  <Image
                    src={scent.clean}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-contain p-6 transition-transform duration-[900ms] ease-spritz group-hover:scale-[1.05] md:p-8"
                  />

                  <p className="sp-display absolute left-4 top-4 text-[clamp(1.5rem,3vw,2.4rem)] uppercase text-ink">
                    {t(`genders.${gender}`)}
                  </p>

                  {/* The arrow-in-a-circle from the reference. */}
                  <span
                    aria-hidden
                    className="absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-paper text-lg leading-none text-ink shadow-hard-sm transition-transform duration-200 ease-spritz group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>

                <StripeBand color={scent.stripe} height={10} />
                <p className="px-4 py-3 font-sans text-xs font-bold uppercase tracking-[0.1em] text-muted">
                  {t("count", { count })}
                </p>
              </Link>
            </li>
          );
        })}
        </ul>
      </ClipReveal>
    </section>
  );
}
