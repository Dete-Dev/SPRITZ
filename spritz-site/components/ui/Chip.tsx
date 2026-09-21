"use client";

/**
 * Pill filter / quick-pick chip. Selected reads as inked with a hard shadow,
 * matching the CTA language without being a CTA (rule 2: red stays the only
 * button colour, so chips are ink/paper only).
 */
export default function Chip({
  children,
  selected = false,
  disabled = false,
  onClick,
  ariaPressed,
}: {
  children: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  ariaPressed?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={ariaPressed ?? selected}
      onClick={onClick}
      className={`rounded-full border-2 border-ink px-5 py-2 font-sans text-xs font-bold uppercase tracking-[0.06em] transition-all duration-150 ease-spritz disabled:cursor-not-allowed disabled:opacity-40 ${
        selected
          ? "bg-ink text-paper shadow-hard-sm"
          : "bg-paper text-ink hover:-translate-y-px hover:shadow-hard-sm"
      }`}
    >
      {children}
    </button>
  );
}
