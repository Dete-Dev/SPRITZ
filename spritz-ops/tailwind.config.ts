import type { Config } from "tailwindcss";

/**
 * SPRITZ v2 "Vandal" — Tailwind mapping.
 * Token values live in app/tokens/*.css (vendored from the design system
 * package, single source of truth). This file only exposes them to utilities.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Guideline palette
        ink: "var(--sp-ink)",
        blue: "var(--sp-blue)",
        red: "var(--sp-red)",
        yellow: "var(--sp-yellow)",
        pink: "var(--sp-pink)",
        green: "var(--sp-green)",
        // Neutrals
        paper: "var(--sp-paper)",
        "paper-2": "var(--sp-paper-2)",
        line: "var(--sp-line)",
        muted: "var(--sp-muted)",
        // Ink-surface neutrals
        "ink-2": "var(--sp-ink-2)",
        "ink-line": "var(--sp-ink-line)",
        cream: "var(--sp-cream)",
        // Scent colourways
        ananas: "var(--sp-scent-ananas)",
        cerise: "var(--sp-scent-cerise)",
        menthe: "var(--sp-scent-menthe)",
        safran: "var(--sp-scent-safran)",
        truffe: "var(--sp-scent-truffe)",
        // Legacy alias — unmigrated sections still say `text-ivory` on ink.
        ivory: "var(--sp-cream)",
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
