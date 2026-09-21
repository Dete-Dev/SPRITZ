"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { SCENTS } from "@/lib/scents";
import Cta from "@/components/ui/Cta";
import ScentCard from "@/components/ui/ScentCard";
import { Mark, Spray } from "@/components/ui/vandal";
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
  const tCommon = useTranslations("common");
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
      id="finder"
      aria-labelledby="finder-heading"
      className="relative overflow-hidden bg-paper-2 px-gutter py-section"
    >
      <Spray
        color="var(--sp-pink)"
        opacity={0.3}
        className="absolute -right-28 -top-20 h-[26rem] w-[26rem]"
      />

      <div className="relative mx-auto max-w-3xl">
        <header className="mb-12 text-center">
          <p className="sp-eyebrow">{t("eyebrow")}</p>
          <h2 id="finder-heading" className="sp-display mt-5 text-d-2xl">
            <Mark color="var(--sp-pink)">{t("headline")}</Mark>
          </h2>
          <p className="mx-auto mt-6 max-w-md font-sans text-d-lg text-muted">
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
                className="mb-8 w-full rounded-full border-2 border-ink bg-paper px-5 py-3 font-sans text-base text-ink placeholder:text-muted focus:outline-none disabled:opacity-50"
              />

              <div className="flex items-center justify-center">
                {phase === "loading" ? (
                  <LoadingDots label={t("loading")} />
                ) : (
                  <Cta
                    onClick={handleSubmit}
                    variant="primary"
                    className={hasInput ? "" : "pointer-events-none opacity-40"}
                  >
                    {t("submit")}
                  </Cta>
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
              <p className="mb-10 font-sans text-d-lg text-muted">
                {t("fallback")}
              </p>
              <ul className="grid grid-cols-2 items-stretch gap-5 text-left sm:grid-cols-3 lg:grid-cols-5">
                {SCENTS.map((scent) => (
                  <li key={scent.key}>
                    <ScentCard
                      scent={scent}
                      priceLabel={tCommon("price", { price: scent.price })}
                      inspiredByLabel={tCommon("inspiredBy", { name: scent.inspiredBy })}
                    />
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={restart}
                className="sp-eyebrow mt-10 underline-offset-4 hover:text-ink hover:underline"
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
            style={{ backgroundColor: scent.stripe }}
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
      <p className="sp-eyebrow">{label}</p>
    </div>
  );
}
