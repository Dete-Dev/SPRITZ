"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SCENTS } from "@/lib/scents";
import FinderChips from "./FinderChips";
import FinderResult from "./FinderResult";

const OCCASIONS = ["day", "evening", "work", "gift"] as const;
const INTENSITIES = ["quiet", "present", "loud"] as const;
const CHARACTERS = ["sweet", "dry", "fresh", "dark"] as const;
const MAX_FREE_TEXT = 280;

type Phase = "idle" | "loading" | "result" | "fallback";

interface Recommendation {
  scentKey: string;
  reason: string;
}

/**
 * AI scent finder — home page section between The Five and Craft.
 *
 * Three optional chip questions + one optional free-text line → one
 * recommendation from /api/scent-finder (Claude). Any failure (no API key,
 * rate limit, network) lands on the fallback: all five bottles, no dead end.
 */
export default function ScentFinder() {
  const t = useTranslations("finder");
  const locale = useLocale();

  const [phase, setPhase] = useState<Phase>("idle");
  const [occasion, setOccasion] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<string | null>(null);
  const [character, setCharacter] = useState<string | null>(null);
  const [freeText, setFreeText] = useState("");
  const [result, setResult] = useState<Recommendation | null>(null);

  const hasInput =
    occasion !== null ||
    intensity !== null ||
    character !== null ||
    freeText.trim().length > 0;

  function restart(): void {
    setPhase("idle");
    setResult(null);
  }

  async function handleSubmit(): Promise<void> {
    if (!hasInput || phase === "loading") return;
    setPhase("loading");
    try {
      const response = await fetch("/api/scent-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          occasion: occasion ?? undefined,
          intensity: intensity ?? undefined,
          character: character ?? undefined,
          freeText: freeText.trim() || undefined,
        }),
      });
      if (!response.ok) {
        setPhase("fallback");
        return;
      }
      const data = (await response.json()) as Recommendation;
      setResult(data);
      setPhase("result");
    } catch {
      setPhase("fallback");
    }
  }

  const chipGroups = [
    {
      key: "occasion",
      label: t("occasionLabel"),
      options: OCCASIONS.map((v) => ({ value: v, label: t(`occasion.${v}`) })),
      selected: occasion,
      onSelect: setOccasion,
    },
    {
      key: "intensity",
      label: t("intensityLabel"),
      options: INTENSITIES.map((v) => ({
        value: v,
        label: t(`intensity.${v}`),
      })),
      selected: intensity,
      onSelect: setIntensity,
    },
    {
      key: "character",
      label: t("characterLabel"),
      options: CHARACTERS.map((v) => ({
        value: v,
        label: t(`character.${v}`),
      })),
      selected: character,
      onSelect: setCharacter,
    },
  ];

  return (
    <section
      aria-labelledby="finder-heading"
      className="px-6 py-28 md:py-36"
    >
      <div className="mx-auto max-w-3xl">
        <header className="mb-14 text-center">
          <p className="mb-6 text-[11px] uppercase tracking-[0.45em] text-ink/60">
            {t("eyebrow")}
          </p>
          <h2
            id="finder-heading"
            className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[0.98] text-ink mb-5"
          >
            {t("headline")}
          </h2>
          <p className="mx-auto max-w-md text-[15px] leading-relaxed text-ink/70">
            {t("intro")}
          </p>
        </header>

        <AnimatePresence mode="wait">
          {(phase === "idle" || phase === "loading") && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              {chipGroups.map((group) => (
                <FinderChips
                  key={group.key}
                  label={group.label}
                  options={group.options}
                  selected={group.selected}
                  onSelect={group.onSelect}
                  disabled={phase === "loading"}
                />
              ))}

              <input
                type="text"
                value={freeText}
                maxLength={MAX_FREE_TEXT}
                disabled={phase === "loading"}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder={t("freeTextPlaceholder")}
                className="mb-8 w-full border-b border-ink/25 bg-transparent pb-3 text-[15px] text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none disabled:opacity-50"
              />

              <div className="flex items-center justify-center">
                {phase === "loading" ? (
                  <LoadingDots label={t("loading")} />
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!hasInput}
                    className="inline-flex items-center rounded-full border border-ink/70 bg-ink px-8 py-3 text-[11px] uppercase tracking-[0.32em] text-ivory transition-colors hover:bg-transparent hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t("submit")}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {phase === "result" && result && (
            <motion.div key="result" exit={{ opacity: 0 }}>
              <FinderResult
                scentKey={result.scentKey}
                reason={result.reason}
                onRestart={restart}
              />
            </motion.div>
          )}

          {phase === "fallback" && (
            <motion.div
              key="fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <p className="mb-10 text-[15px] leading-relaxed text-ink/70">
                {t("fallback")}
              </p>
              <ul className="flex flex-wrap items-end justify-center gap-6">
                {SCENTS.map((scent) => (
                  <li key={scent.key}>
                    <Link
                      href={`/scents/${scent.key}`}
                      className="group block text-center"
                    >
                      <span className="relative block h-32 w-24">
                        <Image
                          src={scent.clean}
                          alt={scent.name}
                          fill
                          sizes="96px"
                          className="object-contain transition-transform duration-300 group-hover:-translate-y-1"
                        />
                      </span>
                      <span
                        aria-hidden
                        className="mx-auto mt-3 block h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: scent.accent }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={restart}
                className="mt-10 text-[11px] uppercase tracking-[0.32em] text-ink/50 underline-offset-4 hover:text-ink hover:underline"
              >
                {t("restart")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/** Five accent dots pulsing in sequence — the loading state. */
function LoadingDots({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-4" role="status">
      <div className="flex items-center gap-2.5">
        {SCENTS.map((scent, i) => (
          <motion.span
            key={scent.key}
            className="block h-2 w-2 rounded-full"
            style={{ backgroundColor: scent.accent }}
            animate={{ opacity: [0.25, 1, 0.25], scale: [1, 1.25, 1] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <p className="text-[10px] uppercase tracking-[0.4em] text-ink/50">
        {label}
      </p>
    </div>
  );
}
