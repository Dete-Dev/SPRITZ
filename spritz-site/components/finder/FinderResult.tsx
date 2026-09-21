"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Cta from "@/components/ui/Cta";
import LabelName from "@/components/ui/LabelName";
import { Spray, StripeBand } from "@/components/ui/vandal";
import { SCENTS } from "@/lib/scents";

interface FinderResultProps {
  scentKey: string;
  reason: string;
  onRestart: () => void;
}

/**
 * The recommendation, presented as a pasted-on card: 2px ink border, hard
 * shadow, the matched scent's stripe banded across the top, and a spray hit
 * in its colourway behind the bottle.
 */
export default function FinderResult({
  scentKey,
  reason,
  onRestart,
}: FinderResultProps) {
  const t = useTranslations("finder");
  const scent = SCENTS.find((s) => s.key === scentKey);
  if (!scent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-3xl overflow-hidden rounded-card border-2 border-ink bg-paper shadow-hard"
    >
      <StripeBand color={scent.stripe} height={14} />

      <div className="flex flex-col items-center gap-8 p-6 md:flex-row md:gap-12 md:p-10">
        <div className="relative h-64 w-48 shrink-0">
          <Spray
            color={scent.stripe}
            opacity={0.4}
            className="absolute inset-[-8%]"
          />
          <Image
            src={scent.clean}
            alt={scent.name}
            fill
            sizes="192px"
            className="relative object-contain"
          />
        </div>

        <div className="text-center md:text-left">
          <p className="sp-eyebrow">{t("resultEyebrow")}</p>
          <h3 className="sp-display mt-4 text-d-xl lowercase">
            <LabelName name={scent.name} noteWords={scent.noteWords} />
          </h3>
          <p className="mx-auto mt-5 max-w-md font-sans text-base text-muted md:mx-0">
            {reason}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <Cta href={`/scents/${scent.key}`} variant="primary">
              {t("viewScent")}
            </Cta>
            <button
              type="button"
              onClick={onRestart}
              className="sp-eyebrow underline-offset-4 hover:text-ink hover:underline"
            >
              {t("restart")}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
