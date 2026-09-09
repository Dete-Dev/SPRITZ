import Cta from "@/components/ui/Cta";
import { StripeBand, Mark } from "@/components/ui/vandal";

/**
 * SPRITZ CTA band — the repeating ask between content sections.
 *
 * Rule 4 of the design system: every content section is followed by an ask,
 * no dead scroll. This is that ask, pinned top and bottom by the guideline's
 * diagonal label stripe and carrying one marker swipe in the headline.
 *
 * `stripe` takes any brand or scent colour token so each band can wear the
 * colourway of the section it follows.
 */
interface CtaBandProps {
  eyebrow: string;
  /** Headline text before the marker swipe. */
  title: string;
  /** The words the marker swipe sits under. Omit for a plain headline. */
  titleMark?: string;
  body?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  /** CSS colour for the stripes and the marker swipe. */
  stripe?: string;
  /** Ink surface instead of paper — v2's two worlds. */
  tone?: "paper" | "ink";
}

export default function CtaBand({
  eyebrow,
  title,
  titleMark,
  body,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  stripe = "var(--sp-red)",
  tone = "paper",
}: CtaBandProps) {
  const dark = tone === "ink";

  return (
    <section
      data-header-bg={dark ? "dark" : undefined}
      className={`relative overflow-hidden px-gutter py-section ${
        dark ? "sp-surface-ink sp-grain" : "bg-paper-2 text-ink"
      }`}
    >
      <StripeBand color={stripe} height={14} className="absolute inset-x-0 top-0" />
      <StripeBand color={stripe} height={14} className="absolute inset-x-0 bottom-0" />

      <div className="mx-auto max-w-3xl text-center">
        <p className="sp-eyebrow">{eyebrow}</p>
        <h2 className="sp-display mt-4 text-d-2xl">
          {title}
          {titleMark ? (
            <>
              {" "}
              <Mark color={stripe}>{titleMark}</Mark>
            </>
          ) : null}
        </h2>
        {body ? (
          <p className="mx-auto mt-5 max-w-xl font-sans text-d-lg text-muted">
            {body}
          </p>
        ) : null}

        <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Cta href={primaryHref} variant="primary">
            {primaryLabel}
          </Cta>
          {secondaryLabel && secondaryHref ? (
            <Cta
              href={secondaryHref}
              variant={dark ? "outline-invert" : "ghost"}
            >
              {secondaryLabel}
            </Cta>
          ) : null}
        </div>
      </div>
    </section>
  );
}
