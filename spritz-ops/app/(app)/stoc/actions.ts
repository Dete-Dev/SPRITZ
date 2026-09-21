"use server";

import { revalidatePath } from "next/cache";
import { serverDb } from "@/lib/db";
import { MATERIAL_KINDS, UNITS } from "@/lib/format";

/**
 * Writes for the stock screen. Server actions rather than API routes: the form
 * posts straight here, so there is no fetch layer and no second copy of the
 * shape to keep in step.
 *
 * Validation happens here even though the database also constrains these
 * columns. The database check is the guarantee; this one is what turns a
 * mistake into a sentence a person can read.
 */

export type Result = { ok: true } | { ok: false; error: string };

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

function positiveNumber(raw: string, label: string): number | string {
  // Romanian keyboards type a decimal comma; accept it rather than rejecting
  // "0,4" as not a number.
  const n = Number(raw.replace(",", "."));
  if (!Number.isFinite(n)) return `${label} nu e un număr.`;
  if (n < 0) return `${label} nu poate fi negativ.`;
  return n;
}

export async function addMaterial(_prev: Result | null, form: FormData): Promise<Result> {
  const code = str(form, "code");
  const name = str(form, "name");
  const kind = str(form, "kind");
  const unit = str(form, "unit");

  if (!code) return { ok: false, error: "Codul e obligatoriu." };
  if (!name) return { ok: false, error: "Numele e obligatoriu." };
  if (!MATERIAL_KINDS.some((k) => k.value === kind)) return { ok: false, error: "Tip necunoscut." };
  if (!UNITS.includes(unit as (typeof UNITS)[number])) return { ok: false, error: "Unitate necunoscută." };

  const cost = positiveNumber(str(form, "unit_cost_cents") || "0", "Costul");
  if (typeof cost === "string") return { ok: false, error: cost };
  const reorder = positiveNumber(str(form, "reorder_point") || "0", "Pragul");
  if (typeof reorder === "string") return { ok: false, error: reorder };

  const db = await serverDb();
  const { error } = await db.from("materials").insert({
    code, name, kind, unit,
    unit_cost_cents: cost,
    reorder_point: reorder,
    supplier_id: str(form, "supplier_id") || null,
  });

  if (error) {
    return {
      ok: false,
      error: error.code === "23505" ? `Codul ${code} există deja.` : error.message,
    };
  }
  revalidatePath("/stoc");
  return { ok: true };
}

/**
 * The only way to change stock by hand. It appends to the ledger rather than
 * editing it — the trigger refuses edits, and an inventory count that
 * disagrees with the books is itself a fact worth keeping.
 */
export async function adjustStock(_prev: Result | null, form: FormData): Promise<Result> {
  const materialId = str(form, "material_id");
  const note = str(form, "note");
  if (!materialId) return { ok: false, error: "Alege materialul." };

  const raw = str(form, "qty").replace(",", ".");
  const n = Number(raw);
  if (!Number.isFinite(n)) return { ok: false, error: "Cantitatea nu e un număr." };
  if (n === 0) return { ok: false, error: "O ajustare de zero nu spune nimic." };
  if (!note) return { ok: false, error: "Scrie motivul — altfel nimeni nu știe de ce s-a schimbat." };

  const db = await serverDb();
  const { data: { user } } = await db.auth.getUser();
  const { error } = await db.from("stock_moves").insert({
    item_type: "material",
    material_id: materialId,
    qty: n,
    reason: "adjustment",
    note,
    created_by: user?.id ?? null,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/stoc");
  return { ok: true };
}
