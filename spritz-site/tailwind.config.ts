import type { Config } from "tailwindcss";

/**
 * SPRITZ v2 "Vandal" — Tailwind mapping.
 * Token values live in app/tokens/*.css (vendored from the design system
 * package, single source of truth). This file only exposes them to utilities.
 */
/**
 * The palette lives in CSS custom properties, and a bare `var()` gives Tailwind
 * nothing to blend, so every opacity modifier (`text-cream/85`, `bg-ink/40`,
 * `via-ink/70`) silently generated no rule at all — the class simply did not
 * exist. Routing each token through `color-mix` restores them.
 */
const token = (name: string): string =>
  // Tailwind accepts a resolver function wherever a colour string goes, but its
  // published types only describe the string form, hence the cast.
  ((({ opacityValue }: { opacityValue?: string }) =>
    opacityValue === undefined
      ? `var(${name})`
      : `color-mix(in srgb, var(${name}) calc(${opacityValue} * 100%), transparent)`) as unknown) as string;

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Guideline palette
        ink: token("--sp-ink"),
        blue: token("--sp-blue"),
        red: token("--sp-red"),
        yellow: token("--sp-yellow"),
        pink: token("--sp-pink"),
        green: token("--sp-green"),
        // Neutrals
        paper: token("--sp-paper"),
        "paper-2": token("--sp-paper-2"),
        line: token("--sp-line"),
        muted: token("--sp-muted"),
        // Ink-surface neutrals
        "ink-2": token("--sp-ink-2"),
        "ink-line": token("--sp-ink-line"),
        cream: token("--sp-cream"),
        // Scent colourways
        ananas: token("--sp-scent-ananas"),
        cerise: token("--sp-scent-cerise"),
        menthe: token("--sp-scent-menthe"),
        safran: token("--sp-scent-safran"),
        truffe: token("--sp-scent-truffe"),
        // Legacy alias — unmigrated sections still say `text-ivory` on ink.
        ivory: token("--sp-cream"),
      },
      fontFamily: {
        sans: ["var(--sp-font-sans)"],
        serif: ["var(--sp-font-serif)"],
        // Legacy sections ask for `font-display`; v2 routes it to Alegreya.
        display: ["var(--sp-font-serif)"],
      },
      fontSize: {
        hero: "var(--sp-text-hero)",
        "d-2xl": "var(--sp-text-2xl)",
        "d-xl": "var(--sp-text-xl)",
        "d-lg": "var(--sp-text-lg)",
      },
      spacing: {
        gutter: "var(--sp-gutter)",
        section: "var(--sp-section)",
      },
      borderRadius: {
        card: "var(--sp-radius-card)",
      },
      boxShadow: {
        hard: "var(--sp-shadow-hard)",
        "hard-sm": "var(--sp-shadow-hard-sm)",
        "hard-lift": "var(--sp-shadow-hard-lift)",
      },
      letterSpacing: {
        widest: "0.4em",
      },
      transitionTimingFunction: {
        spritz: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
