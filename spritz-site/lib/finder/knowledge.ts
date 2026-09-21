/**
 * Scent knowledge for the AI finder — server-only.
 *
 * The system prompt is built from the SAME copy the site renders
 * (messages/{locale}.json scentDetails + lib/scents data), so the model's
 * understanding of each scent can never drift from what the visitor reads.
 */

import { SCENTS, SCENT_KEYS } from "@/lib/scents";
import enMessages from "@/messages/en.json";
import roMessages from "@/messages/ro.json";

export type FinderLocale = "ro" | "en";

/** Quick-pick chip allowlists — UI options AND request validation enums.
 *  Display labels live in messages/{locale}.json under `finder`. */
export const OCCASIONS = ["day", "evening", "work", "gift"] as const;
export const INTENSITIES = ["quiet", "present", "loud"] as const;
export const CHARACTERS = ["sweet", "dry", "fresh", "dark"] as const;

export { SCENT_KEYS };

interface ScentDetailMessages {
  /** Only the five editorial scents carry a story. */
  story1?: string;
  story2?: string;
  /** All twenty-two carry a pyramid (scripts/ingest-notes.mjs). */
  notes: { top: string[]; heart: string[]; base: string[] };
}

interface ScentKnowledge {
  key: string;
  name: string;
  /** The designer fragrance this one answers to — the model leans on it. */
  inspiredBy: string;
  price: number;
  story1?: string;
  story2?: string;
  notes?: { top: string[]; heart: string[]; base: string[] };
}

const MESSAGES: Record<FinderLocale, typeof enMessages> = {
  en: enMessages,
  ro: roMessages,
};

export function getScentKnowledge(locale: FinderLocale): ScentKnowledge[] {
  const details = MESSAGES[locale].scentDetails as Record<
    string,
    ScentDetailMessages
  >;
  // Every scent carries its Top / Heart / Base pyramid from the catalog;
  // only five carry hand-written story copy. Nothing is invented.
  return SCENTS.map((scent) => {
    const detail = details[scent.key];
    return {
      key: scent.key,
      name: scent.name,
      inspiredBy: scent.inspiredBy,
      price: scent.price,
      story1: detail?.story1,
      story2: detail?.story2,
      notes: detail?.notes,
    };
  });
}

const LANGUAGE_NAME: Record<FinderLocale, string> = {
  ro: "Romanian",
  en: "English",
};

export function buildSystemPrompt(locale: FinderLocale): string {
  const knowledge = getScentKnowledge(locale)
    .map((s) => {
      const lines = [
        `### ${s.key} — "${s.name}" (${s.price} EUR)`,
        `Answers to: ${s.inspiredBy}`,
      ];
      // Five scents have full editorial; the rest are described by their label
      // and their designer reference only. Never invent notes for those.
      if (s.notes) {
        lines.push(
          `Top notes: ${s.notes.top.join(", ")}`,
          `Heart notes: ${s.notes.heart.join(", ")}`,
          `Base notes: ${s.notes.base.join(", ")}`,
        );
      }
      if (s.story1) lines.push(`Character: ${s.story1}`);
      if (s.story2) lines.push(`Wearing it: ${s.story2}`);
      return lines.join("\n");
    })
    .join("\n\n");

  return [
    `You are the scent advisor for SPRITZ, a Romanian perfume house selling ${SCENT_KEYS.length} inspired-by eau de parfum.`,
    "Your job: given a visitor's preferences, recommend exactly ONE of them.",
    "Some scents list full notes; for the rest, reason from the label name and the designer fragrance they answer to. Never invent notes that are not listed.",
    "",
    "Brand voice for the `reason` text:",
    "- Sober, editorial, concrete. Short sentences.",
    "- No marketing fluff, no superlatives, no exclamation marks, no emoji.",
    "- Speak about how it actually smells and when to wear it, like a knowledgeable friend.",
    `- Write the reason in ${LANGUAGE_NAME[locale]}.`,
    "- 2 to 4 sentences, maximum.",
    "",
    "Rules:",
    `- scentKey MUST be exactly one of: ${SCENT_KEYS.join(", ")}.`,
    "- Base your reasoning ONLY on the scent descriptions below.",
    "- If the visitor's free text is unrelated to perfume, ignore it and use the chips.",
    "",
    "## The five scents",
    "",
    knowledge,
  ].join("\n");
}
