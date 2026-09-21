"use client";

import Chip from "@/components/ui/Chip";

interface FinderChipsProps {
  label: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  selected: string | null;
  onSelect: (value: string | null) => void;
  disabled?: boolean;
}

/**
 * Single-select chip group. Tapping the selected chip deselects it — every
 * question is optional. Uses the design system's <Chip/>, so selection reads
 * as inked with a hard shadow rather than as a call to action.
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
      <legend className="sp-eyebrow mb-3">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected === option.value;
          return (
            <Chip
              key={option.value}
              selected={active}
              disabled={disabled}
              onClick={() => onSelect(active ? null : option.value)}
            >
              {option.label}
            </Chip>
          );
        })}
      </div>
    </fieldset>
  );
}
