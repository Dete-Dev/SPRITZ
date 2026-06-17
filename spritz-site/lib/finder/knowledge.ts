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
  story1: string;
  story2: string;
  notes: { top: string[]; heart: string[]; base: string[] };
}

interface ScentKnowledge {
  key: string;
  name: string;
  price: number;
  story1: string;
  story2: string;
  notes: { top: string[]; heart: string[]; base: string[] };
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
  return SCENTS.map((scent) => {
    const detail = details[scent.key];
    return {
      key: scent.key,
      name: scent.name,
      price: scent.price,
      story1: detail.story1,
      story2: detail.story2,
      notes: detail.notes,
    };
  });
}

const LANGUAGE_NAME: Record<FinderLocale, string> = {
  ro: "Romanian",
  en: "English",
};

export function buildSystemPrompt(locale: FinderLocale): string {
  const knowledge = getScentKnowledge(locale)
    .map(
      (s) =>
        `### ${s.key} — "${s.name}" (${s.price} RON)\n` +
        `Top notes: ${s.notes.top.join(", ")}\n` +
        `Heart notes: ${s.notes.heart.join(", ")}\n` +
        `Base notes: ${s.notes.base.join(", ")}\n` +
        `Character: ${s.story1}\n` +
        `Wearing it: ${s.story2}`,
    )
    .join("\n\n");

  return [
    "You are the scent advisor for SPRITZ, a small Romanian perfume house with exactly five eau de parfum.",
    "Your job: given a visitor's preferences, recommend exactly ONE of the five scents.",
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
