import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Sticker } from "@/components/ui/vandal";
import PinFrame from "@/components/motion/PinFrame";
import { SCENTS } from "@/lib/scents";

/**
 * The 50/50 split promo — brief §6.
 *
 * Left: one 50ml bottle, straight to its product page.
 * Right: the set offer. SPRITZ has no packaged duo SKU, so "the set" is the
 * bundle builder — pick any two and the −10% tier applies at checkout.
 *
 * This is the page's peak, so the two panels run inside <PinFrame/>: on desktop
 * the frame sticks for three viewport-heights while the choices counter-drift.
 * The copy centres instead of sitting on the bottom edge, because the fixed
 * <BundleBar/> owns that edge whenever a bundle is in progress.
 *
 * The panels are passed as props, not children of a client component's render
 * callback, so this file stays a server component and none of its markup ships.
 */
const SINGLE_KEY = "safran-ambre";
const SET_KEY = "truffe-chocolat";

export default async function SplitPromo() {
  const t = await getTranslations("split");
  const tCommon = await getTranslations("common");

  const single = SCENTS.find((s) => s.key === SINGLE_KEY);
  const set = SCENTS.find((s) => s.key === SET_KEY);
  if (!single || !set) return null;

  const panel =
    "group relative flex min-h-[26rem] flex-col justify-end overflow-hidden md:h-full md:min-h-[34rem] md:justify-center";

  // The scrim tracks the copy rather than the frame. Stacked on a phone the copy
  // sits at the bottom, so the wash runs up from the floor; pinned on desktop it
  // centres, so the wash runs in from the left edge instead. Either way it
  // covers where the text is and nothing else — these bottle shots are pale, and
  // cream type on them is unreadable without it.
  const scrim =
    "absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent md:bg-gradient-to-r md:from-ink/90 md:via-ink/65 md:to-transparent";

  const cta =
    "mt-6 inline-flex items-center gap-2 rounded-full border-2 border-cream px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-cream transition-colors group-hover:bg-cream group-hover:text-ink";

  return (
    <section className="border-y-2 border-ink">
      <PinFrame
        left={
          <Link
            href={`/scents/${single.key}`}
            className={`${panel} border-b-2 border-ink md:border-b-0 md:border-r-2`}
            style={{ backgroundColor: single.accent }}
          >
            <Image
              src={single.hero}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-[900ms] ease-spritz group-hover:scale-[1.04]"
            />
            <div aria-hidden className={scrim} />

            <div className="relative p-7 md:p-10">
              <h3 className="sp-display max-w-sm text-d-xl text-cream">
                {t("singleTitle")}
              </h3>
              <p className="mt-3 font-sans text-base text-cream/85">
                {tCommon("price", { price: single.price })}
              </p>
              <span className={cta}>{t("singleCta")} →</span>
            </div>
          </Link>
        }
        right={
          <Link href="/sets" className={panel} style={{ backgroundColor: set.accent }}>
            <Image
              src={set.hero}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-[900ms] ease-spritz group-hover:scale-[1.04]"
            />
            <div aria-hidden className={scrim} />

            <Sticker
              tilt={5}
              variant="fill"
              fill="var(--sp-yellow)"
              className="absolute right-5 top-5 z-10 md:right-8 md:top-8"
            >
              {t("setBadge")}
            </Sticker>

            <div className="relative p-7 md:p-10">
              <h3 className="sp-display max-w-sm text-d-xl text-cream">
                {t("setTitle")}
              </h3>
              <p className="mt-3 max-w-sm font-sans text-base text-cream/85">
                {t("setBody")}
              </p>
              <span className={cta}>{t("setCta")} →</span>
            </div>
          </Link>
        }
      />
    </section>
  );
}
