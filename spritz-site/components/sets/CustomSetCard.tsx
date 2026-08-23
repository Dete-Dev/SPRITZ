"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useBundle } from "@/components/bundle/BundleProvider";
import Cta from "@/components/ui/Cta";
import { Sticker, StripeBand } from "@/components/ui/vandal";
import { SCENTS } from "@/lib/scents";

/**
 * One of the two headline offers — brief §12's Duo Set Custom and Trio Set
 * Custom. These are the biggest thing on the page because they are the only
 * sets SPRITZ actually sells: you pick the bottles, the tier does the maths.
 *
 * Starts a clean set at the requested size and hands over to the builder, so
 * nobody inherits a half-finished bundle from an earlier visit.
 */
export default function CustomSetCard({
  size,
  percentOff,
  stripe,
  previewKeys,
}: {
  /** Bottles in this offer — 2 for the duo, 3 for the trio. */
  size: number;
  percentOff: number;
  stripe: string;
  /** Bottles shown as the illustration; purely decorative. */
  previewKeys: string[];
}) {
  const t = useTranslations("sets");
  const tCommon = useTranslations("common");
  const { clear } = useBundle();
  const router = useRouter();

  const preview = previewKeys
    .map((k) => SCENTS.find((s) => s.key === k))
    .filter(Boolean)
    .slice(0, 3);

  const full = size * 100;
  const total = full - Math.round((full * percentOff) / 100);

  function start() {
    clear();
    router.push("/bundle");
  }

  return (
    <div className="sp-lift flex h-full flex-col overflow-hidden rounded-card border-2 border-ink bg-paper shadow-hard">
      <StripeBand color={stripe} height={14} />

      {/* Bottles, on plain paper — no gradient behind product. */}
      <div className="relative flex items-end justify-center gap-3 bg-paper-2 px-6 pt-8">
        {preview.map((scent, i) => (
          <span
            key={scent!.key}
            className="relative block w-1/3 max-w-[9rem]"
            style={{ aspectRatio: "1 / 1.6" }}
          >
            <Image
              src={scent!.clean}
              alt=""
              fill
              sizes="(min-width: 768px) 15vw, 30vw"
              className="object-contain"
              priority={i === 0}
            />
          </span>
        ))}
        <span className="absolute left-5 top-5">
          <Sticker tilt={-5} variant="fill" fill={stripe}>
            {t("bottles", { count: size })}
          </Sticker>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <h3 className="sp-display text-d-xl">{t(`custom.${size}.title`)}</h3>
        <p className="mt-3 font-sans text-base text-muted">
          {t(`custom.${size}.body`)}
        </p>

        <div className="mt-6 flex items-baseline gap-3">
          <span className="sp-strike font-sans text-lg text-muted">
            {tCommon("price", { price: full })}
          </span>
          <span className="font-sans text-3xl font-bold">
            {tCommon("price", { price: total })}
          </span>
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-red">
            −{percentOff}%
          </span>
        </div>

        <div className="mt-7">
          <Cta onClick={start} variant="primary" block>
            {t("custom.cta")}
          </Cta>
        </div>
      </div>
    </div>
  );
}
