"use client";

import { useEffect, useRef, useState } from "react";

export interface FilterOption {
  value: string;
  label: string;
}

/**
 * Quick filter dropdown — brief §11's Gender / Scent family / Collections
 * controls in the top right of the shop.
 *
 * Same disclosure mechanics as the search pill: outside-pointerdown and
 * Escape close it. Single-select with a clear row, which is how the two
 * existing chip axes already behave.
 */
export default function FilterDropdown({
  label,
  options,
  value,
  onChange,
  clearLabel,
}: {
  label: string;
  options: FilterOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  clearLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-150 ease-spritz ${
          selected
            ? "border-ink bg-ink text-paper shadow-hard-sm"
            : "border-ink bg-paper text-ink hover:-translate-y-px hover:shadow-hard-sm"
        }`}
      >
        <span>{selected ? selected.label : label}</span>
        <span
          aria-hidden
          className={`text-[9px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={label}
          className="absolute right-0 top-full z-30 mt-2 min-w-[12rem] overflow-hidden rounded-card border-2 border-ink bg-paper shadow-hard"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onChange(value === option.value ? null : option.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left font-sans text-sm transition-colors hover:bg-paper-2 ${
                value === option.value ? "font-bold text-ink" : "text-muted"
              }`}
            >
              {option.label}
              {value === option.value ? (
                <span aria-hidden className="text-red">
                  ✓
                </span>
              ) : null}
            </button>
          ))}

          {value ? (
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className="w-full border-t-2 border-ink px-4 py-2.5 text-left font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-red hover:bg-paper-2"
            >
              {clearLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
