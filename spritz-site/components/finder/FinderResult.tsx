"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SCENTS } from "@/lib/scents";

interface FinderResultProps {
  scentKey: string;
  reason: string;
  onRestart: () => void;
}

/**
 * The recommendation card: bottle, name, the model's editorial reason,
 * CTA to the product page. Accent-tinted halo from the scent's label color.
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
      className="mx-auto flex max-w-3xl flex-col items-center gap-10 md:flex-row md:gap-14"
    >
      <div className="relative h-72 w-56 shrink-0">
        <div
          aria-hidden
          className="absolute inset-0 rounded-full blur-3xl opacity-25"
          style={{ backgroundColor: scent.accent }}
        />
        <Image
          src={scent.clean}
          alt={scent.name}
          fill
          sizes="224px"
          className="relative object-contain"
        />
      </div>

      <div className="text-center md:text-left">
        <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-ink/50">
          {t("resultEyebrow")}
        </p>
        <h3 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.02] whitespace-pre-line text-ink mb-5">
          {scent.nameDisplay}
        </h3>
        <p className="mx-auto max-w-md text-[15px] leading-relaxed text-ink/75 md:mx-0 mb-8">
          {reason}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
          <Link
            href={`/scents/${scent.key}`}
            className="inline-flex items-center rounded-full border border-ink/70 bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.32em] text-ivory transition-colors hover:bg-transparent hover:text-ink"
          >
            {t("viewScent")}
          </Link>
          <button
            type="button"
            onClick={onRestart}
            className="text-[11px] uppercase tracking-[0.32em] text-ink/50 underline-offset-4 hover:text-ink hover:underline"
          >
            {t("restart")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
