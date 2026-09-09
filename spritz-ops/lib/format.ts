/**
 * Display helpers.
 *
 * One thing to know before touching any number here: PostgREST returns
 * Postgres `numeric` columns as STRINGS, on purpose — a numeric can hold more
 * precision than a JS float. So every quantity and every fractional cost
 * arrives as a string and has to be converted explicitly. `num()` is that
 * conversion, in one place, so nobody is tempted to do arithmetic on a string
 * and get "1010" out of 10 + 10.
 */

/** Postgres numeric (string) or integer (number) → number. */
export function num(v: string | number | null | undefined): number {
  if (v === null || v === undefined) return 0;
  return typeof v === "number" ? v : Number(v);
}

const EUR = new Intl.NumberFormat("ro-RO", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Cents → "1.234,56 €". Rounds at the last moment, never before. */
export function money(cents: string | number | null | undefined): string {
  return EUR.format(num(cents) / 100);
}

const QTY = new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 3 });

/** A quantity with its unit: "1.250 ml", "40 buc". */
export function qty(v: string | number | null | undefined, unit?: string): string {
  return unit ? `${QTY.format(num(v))} ${unit}` : QTY.format(num(v));
}

/** Percentage of price kept, for the margin column. Null when price is 0. */
export function marginPct(priceCents: number, marginCents: number): string {
  if (!priceCents) return "—";
  return `${Math.round((marginCents / priceCents) * 100)}%`;
}

const DATE = new Intl.DateTimeFormat("ro-RO", { day: "2-digit", month: "short", year: "numeric" });

export function date(iso: string | null | undefined): string {
  return iso ? DATE.format(new Date(iso)) : "—";
}

export const MATERIAL_KINDS = [
  { value: "concentrate", label: "Concentrat" },
  { value: "alcohol", label: "Alcool" },
  { value: "bottle", label: "Sticlă" },
  { value: "cap", label: "Capac" },
  { value: "label", label: "Etichetă" },
  { value: "box", label: "Cutie" },
  { value: "other", label: "Altele" },
] as const;

export const UNITS = ["ml", "g", "buc"] as const;

export function kindLabel(kind: string): string {
  return MATERIAL_KINDS.find((k) => k.value === kind)?.label ?? kind;
}

export const COMPANY_TYPES = [
  { value: "retail", label: "Magazin" },
  { value: "salon", label: "Salon" },
  { value: "corporate", label: "Corporate" },
  { value: "other", label: "Altele" },
] as const;

/**
 * The pipeline, in order. `won` and `lost` are terminal and sit apart from the
 * three that are still moving — a board that mixes them reads as if a lost
 * deal were one step from closing.
 */
export const DEAL_STAGES = [
  { value: "lead", label: "Lead", open: true },
  { value: "qualified", label: "Calificat", open: true },
  { value: "quoted", label: "Ofertat", open: true },
  { value: "won", label: "Câștigat", open: false },
  { value: "lost", label: "Pierdut", open: false },
] as const;

export const ACTIVITY_KINDS = [
  { value: "call", label: "Telefon" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Întâlnire" },
  { value: "note", label: "Notă" },
] as const;

export function stageLabel(stage: string): string {
  return DEAL_STAGES.find((s) => s.value === stage)?.label ?? stage;
}

export function companyTypeLabel(type: string): string {
  return COMPANY_TYPES.find((t) => t.value === type)?.label ?? type;
}

export function kindActivityLabel(kind: string): string {
  return ACTIVITY_KINDS.find((k) => k.value === kind)?.label ?? kind;
}

/** How overdue a next step is, in whole days. Negative means still ahead. */
export function daysOverdue(isoDate: string | null | undefined): number | null {
  if (!isoDate) return null;
  const due = new Date(`${isoDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((today.getTime() - due.getTime()) / 86_400_000);
}
