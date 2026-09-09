"use client";

import { useFormStatus } from "react-dom";
import Cta from "@/components/ui/Cta";

/**
 * The form furniture, in the house voice: ink rules, uppercase micro-labels,
 * hard shadow on the panel. Deliberately plain inputs — the vandal elements
 * are for headers and empty states, not for every field.
 */

const inputClass =
  "mt-1.5 w-full border-2 border-ink bg-paper px-3 py-2 font-sans text-sm outline-none transition-colors focus:border-red";

const labelClass =
  "font-sans text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted";

export function Field({
  label, name, type = "text", required, placeholder, defaultValue, hint, step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number;
  hint?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input
        className={inputClass}
        name={name}
        type={type}
        step={step}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
      {hint && <span className="mt-1 block font-sans text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Select({
  label, name, options, required, placeholder,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <select className={inputClass} name={name} required={required} defaultValue="">
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

/** Disables itself while the action is in flight, so nobody double-posts. */
export function Submit({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Cta type="submit" size="sm" variant={pending ? "ghost" : "primary"}>
      {pending ? "Se salvează…" : children}
    </Cta>
  );
}

export function FormMessage({ state }: { state: { ok: boolean; error?: string } | null }) {
  if (!state) return null;
  if (state.ok) {
    return <p role="status" className="font-sans text-sm text-green">Salvat.</p>;
  }
  return <p role="alert" className="font-sans text-sm font-bold text-red">{state.error}</p>;
}

export function Panel({
  title, children, tone = "paper",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "paper" | "quiet";
}) {
  return (
    <section
      className={`border-2 border-ink p-5 shadow-hard-sm ${tone === "quiet" ? "bg-paper-2" : "bg-paper"}`}
    >
      <h2 className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
