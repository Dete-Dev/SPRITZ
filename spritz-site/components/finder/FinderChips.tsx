"use client";

interface FinderChipsProps {
  label: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  selected: string | null;
  onSelect: (value: string | null) => void;
  disabled?: boolean;
}

/**
 * Single-select pill chip group. Tapping the selected chip deselects it —
 * every question is optional. Selected state mirrors the site's CTA pill
 * language: ink fill, ivory text.
 */
export default function FinderChips({
  label,
  options,
  selected,
  onSelect,
  disabled,
}: FinderChipsProps) {
  return (
    <fieldset className="mb-7">
      <legend className="mb-3 text-[10px] uppercase tracking-[0.4em] text-ink/50">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              onClick={() => onSelect(active ? null : option.value)}
              className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.28em] transition-colors disabled:opacity-50 ${
                active
                  ? "border-ink bg-ink text-ivory"
                  : "border-ink/25 text-ink/70 hover:border-ink/60 hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
