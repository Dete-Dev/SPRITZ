import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Cta from "@/components/ui/Cta";
import { Mark, Spray, Sticker, StripeBand, Tape } from "@/components/ui/vandal";
import LabelName from "@/components/ui/LabelName";
import { SCENTS } from "@/lib/scents";

export const metadata: Metadata = {
  title: "SPRITZ — Design System",
  robots: { index: false, follow: false },
};

/**
 * Living design-system reference for v2 "Vandal". Everything renders from the
 * same tokens and components the storefront uses, so it cannot drift out of
 * date. Not indexed, not linked from navigation — a team page.
 */

const BRAND = [
  { name: "Ink", token: "--sp-ink", hex: "#0A0A0A", use: "Text, dark world" },
  { name: "Blue", token: "--sp-blue", hex: "#1652C2", use: "Focus, menthe" },
  { name: "Red", token: "--sp-red", hex: "#E5143C", use: "The only CTA colour" },
  { name: "Yellow", token: "--sp-yellow", hex: "#E8B83C", use: "Marks, ananas" },
  { name: "Pink", token: "--sp-pink", hex: "#F178AC", use: "Cerise" },
  { name: "Green", token: "--sp-green", hex: "#16A85F", use: "In stock, truffe" },
];

const NEUTRALS = [
  { name: "Paper", token: "--sp-paper", hex: "#FFFFFF", use: "Shop world" },
  { name: "Paper 2", token: "--sp-paper-2", hex: "#F6F5F3", use: "Bands, cards" },
  { name: "Line", token: "--sp-line", hex: "#E4E2DE", use: "Hairline rules" },
  { name: "Muted", token: "--sp-muted", hex: "#6C6A66", use: "Secondary text" },
  { name: "Cream", token: "--sp-cream", hex: "#F4EDE2", use: "Text on ink — never white" },
];


const TYPE = [
  { label: "Hero", cls: "sp-display text-hero", token: "--sp-text-hero", sample: "Smell expensive." },
  { label: "Display", cls: "sp-display text-d-2xl", token: "--sp-text-2xl", sample: "Same nose. Different price." },
  { label: "Section", cls: "sp-display text-d-xl", token: "--sp-text-xl", sample: "Build your set" },
  { label: "Lead", cls: "font-sans text-d-lg text-muted", token: "--sp-text-lg", sample: "Pick any three and we cut the price." },
  { label: "Body", cls: "font-sans text-base", token: "--sp-text-base", sample: "Five scents inspired by the big houses." },
  { label: "Eyebrow", cls: "sp-eyebrow", token: "--sp-text-xs", sample: "eau de parfum · bucharest · since 2026" },
  { label: "Scrawl", cls: "sp-scrawl text-red -rotate-3 inline-block", token: "—", sample: "best of the dupes" },
];

function Row({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-section">
      <h2 className="sp-display text-d-xl">{title}</h2>
      {note ? (
        <p className="mt-3 max-w-2xl font-sans text-base text-muted">{note}</p>
      ) : null}
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Swatch({ c }: { c: (typeof BRAND)[number] }) {
  return (
    <li className="overflow-hidden rounded-card border border-line">
      <div className="h-20 w-full" style={{ background: `var(${c.token})` }} />
      <div className="p-3">
        <p className="font-sans text-sm font-bold">{c.name}</p>
        <p className="font-sans text-xs text-muted">{c.hex}</p>
        <p className="mt-2 font-sans text-xs text-muted">{c.use}</p>
      </div>
    </li>
  );
}

export default async function DesignSystemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-paper text-ink">
      {/* --- Ink header, so the two worlds are visible from the first screen -- */}
      <header
        data-header-bg="dark"
        className="sp-surface-ink sp-grain relative overflow-hidden px-gutter pb-24 pt-40"
      >
        <Spray
          color="var(--sp-red)"
          opacity={0.4}
          className="absolute -left-20 -top-20 h-[30rem] w-[30rem]"
        />
        <div className="relative mx-auto max-w-5xl">
          <p className="sp-eyebrow">Version 2 — Vandal</p>
          <h1 className="sp-display mt-4 text-d-2xl">
            SPRITZ design system.{" "}
            <Mark color="var(--sp-yellow)">Full vandal.</Mark>
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-d-lg text-cream/80">
            Spray hits, stickers, tape and marker scrawl are UI, not decoration.
            Two worlds: ink for hero and editorial, paper for the shop. Same two
            typefaces as v1, used much harder.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Cta href="/" variant="primary">
              See it live
            </Cta>
            <Sticker tilt={-4} variant="fill" fill="var(--sp-yellow)">
              9 rules, no exceptions
            </Sticker>
          </div>
        </div>
        <StripeBand
          color="var(--sp-red)"
          height={14}
          className="absolute inset-x-0 bottom-0"
        />
      </header>

      <div className="mx-auto max-w-5xl px-gutter pb-24">
        {/* --- Colour ---------------------------------------------------- */}
        <Row
          title="Colour"
          note="Six guideline colours plus neutrals. v2 runs all five loud — sprays, stickers, stripes — but red stays the only button colour. On ink, text is cream, never pure white."
        >
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {BRAND.map((c) => (
              <Swatch key={c.token} c={c} />
            ))}
          </ul>
          <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {NEUTRALS.map((c) => (
              <Swatch key={c.token} c={c} />
            ))}
          </ul>
        </Row>

        {/* --- Scent colourways ------------------------------------------ */}
        <Row
          title="Scent colourways"
          note="All twenty-two, straight from lib/scents.ts. Each stripe colour is sampled from that scent's printed label, so a card can never drift from its bottle. Names are printed on the glass in lowercase French with the note words bold — never translated, never capitalised."
        >
          <ul className="space-y-4">
            {SCENTS.map((s) => (
              <li
                key={s.key}
                className="flex flex-wrap items-center gap-5 rounded-card border border-line p-4"
              >
                <span
                  className="h-12 w-12 shrink-0 rounded-card border border-line"
                  style={{ background: s.accent }}
                />
                <StripeBand
                  color={s.stripe}
                  height={40}
                  className="w-28 shrink-0 rounded-card"
                />
                <span className="min-w-48 flex-1">
                  <span className="text-lg">
                    <LabelName name={s.name} noteWords={s.noteWords} />
                  </span>
                  <span className="sp-eyebrow block">
                    inspired by {s.inspiredBy}
                  </span>
                </span>
                <span className="font-sans text-base font-bold">
                  €{s.price}
                </span>
              </li>
            ))}
          </ul>
        </Row>

        {/* --- Typography ------------------------------------------------ */}
        <Row
          title="Typography"
          note="Alegreya 900 is the display voice — smashed to 0.82 leading, −0.03em tracking, headlines only. Arimo does everything a finger touches. Two families, no exceptions."
        >
          <ul className="space-y-8">
            {TYPE.map((t) => (
              <li
                key={t.label}
                className="grid gap-3 border-b border-line pb-8 md:grid-cols-[8rem_1fr]"
              >
                <div>
                  <p className="font-sans text-sm font-bold">{t.label}</p>
                  <p className="font-sans text-xs text-muted">{t.token}</p>
                </div>
                <p className={t.cls}>{t.sample}</p>
              </li>
            ))}
          </ul>
        </Row>

        {/* --- CTA ------------------------------------------------------- */}
        <Row
          title="Call to action"
          note="One component, four variants, and a hard offset shadow so it reads as pasted on. Primary is the ask. Ghost is the alternative. Invert and outline-invert are for ink. Never build a fifth."
        >
          <div className="flex flex-wrap items-center gap-4">
            <Cta href="#" variant="primary">
              Add to bag
            </Cta>
            <Cta href="#" variant="ghost">
              Find my scent
            </Cta>
            <div className="sp-surface-ink flex gap-4 rounded-card p-5">
              <Cta href="#" variant="invert">
                Shop all
              </Cta>
              <Cta href="#" variant="outline-invert">
                Build a set
              </Cta>
            </div>
            <Cta href="#" variant="primary" size="sm">
              Small
            </Cta>
          </div>
          <div className="mt-6 max-w-sm">
            <Cta href="#" variant="primary" block>
              Block — mobile buy bar
            </Cta>
          </div>
        </Row>

        {/* --- Vandal kit ------------------------------------------------ */}
        <Row
          title="Vandal kit"
          note="The v2 signature. Max three of these per viewport — loud, not messy. Shadows are hard offsets with no blur, so everything looks pasted on rather than floating."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-card border border-line p-6">
              <p className="sp-eyebrow">Spray</p>
              <div className="relative mt-4 h-32 overflow-hidden rounded-card bg-paper-2">
                <Spray
                  color="var(--sp-pink)"
                  opacity={0.55}
                  className="absolute left-6 top-2 h-28 w-28"
                />
                <Spray
                  color="var(--sp-blue)"
                  opacity={0.45}
                  className="absolute right-8 top-8 h-24 w-24"
                />
              </div>
            </div>

            <div className="rounded-card border border-line p-6">
              <p className="sp-eyebrow">Stickers</p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Sticker tilt={-4}>best of the dupes</Sticker>
                <Sticker tilt={3} variant="fill" fill="var(--sp-yellow)">
                  −15% on 3
                </Sticker>
                <Sticker tilt={-2} variant="ink" fill="var(--sp-red)">
                  new
                </Sticker>
              </div>
            </div>

            <div className="rounded-card border border-line p-6">
              <p className="sp-eyebrow">Tape</p>
              <div className="relative mt-6 h-28 rounded-card bg-paper-2">
                <Tape rotate={-5} style={{ position: "absolute", top: -12, left: 24 }} />
                <Tape rotate={4} style={{ position: "absolute", bottom: -12, right: 24 }} />
              </div>
            </div>

            <div className="rounded-card border border-line p-6">
              <p className="sp-eyebrow">Mark & strike</p>
              <p className="sp-display mt-6 text-d-xl">
                Pay <Mark color="var(--sp-yellow)">street.</Mark>
              </p>
              <p className="mt-6 font-sans text-lg">
                <span className="sp-strike text-muted">€290</span>{" "}
                <b>€100</b>{" "}
                <span className="sp-scrawl -rotate-3 inline-block text-red">
                  same nose
                </span>
              </p>
            </div>
          </div>
        </Row>

        {/* --- Rules ----------------------------------------------------- */}
        <Row
          title="Rules"
          note="Break these and it stops looking like SPRITZ."
        >
          <ol className="max-w-2xl space-y-4 font-sans text-base">
            <li><strong>1.</strong> The wordmark keeps its strike-through, always, one colour only.</li>
            <li><strong>2.</strong> Red is the CTA. Scent colours never become buttons.</li>
            <li><strong>3.</strong> Alegreya for headlines, Arimo for everything a finger touches.</li>
            <li><strong>4.</strong> Every content section is followed by an ask. No dead scroll.</li>
            <li><strong>5.</strong> Bottles sit on plain white. No gradients behind product.</li>
            <li><strong>6.</strong> Shadows are hard offsets. No blur.</li>
            <li><strong>7.</strong> Scent names stay lowercase French, verbatim.</li>
            <li><strong>8.</strong> Motion is transform and opacity only, and respects reduced-motion.</li>
            <li><strong>9.</strong> Max three vandal elements per viewport. Loud, not messy.</li>
          </ol>
        </Row>
      </div>
    </main>
  );
}
