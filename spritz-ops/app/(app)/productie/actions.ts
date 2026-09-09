"use server";

import { revalidatePath } from "next/cache";
import { serverDb } from "@/lib/db";

/**
 * Recipes and bottling.
 *
 * `recordBatch` does not write any rows itself — it calls the database
 * function of the same name, which consumes materials and produces stock in
 * ONE transaction. Doing it from here would mean a crash between two writes
 * leaves materials consumed and no bottles to show for them.
 */

export type Result = { ok: true; message?: string } | { ok: false; error: string };

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

function amount(raw: string): number | null {
  const n = Number(raw.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export async function saveBomLine(_prev: Result | null, form: FormData): Promise<Result> {
  const skuId = str(form, "sku_id");
  const materialId = str(form, "material_id");
  const n = amount(str(form, "qty_per_unit"));

  if (!skuId || !materialId) return { ok: false, error: "Alege materialul." };
  if (n === null) return { ok: false, error: "Cantitatea nu e un număr." };
  if (n <= 0) return { ok: false, error: "Cantitatea pe sticlă trebuie să fie peste zero." };

  const db = await serverDb();
  const { error } = await db
    .from("bom_lines")
    .upsert({ sku_id: skuId, material_id: materialId, qty_per_unit: n });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/productie");
  revalidatePath("/stoc");
  return { ok: true };
}

export async function removeBomLine(_prev: Result | null, form: FormData): Promise<Result> {
  const skuId = str(form, "sku_id");
  const materialId = str(form, "material_id");
  if (!skuId || !materialId) return { ok: false, error: "Linie necunoscută." };

  const db = await serverDb();
  const { error } = await db
    .from("bom_lines")
    .delete()
    .eq("sku_id", skuId)
    .eq("material_id", materialId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/productie");
  revalidatePath("/stoc");
  return { ok: true };
}

export async function recordBatch(_prev: Result | null, form: FormData): Promise<Result> {
  const skuKey = str(form, "sku_key");
  const batchCode = str(form, "batch_code");
  const n = amount(str(form, "qty"));

  if (!skuKey) return { ok: false, error: "Alege parfumul." };
  if (!batchCode) return { ok: false, error: "Lotul e obligatoriu — se tipărește pe fiecare sticlă." };
  if (n === null || n <= 0) return { ok: false, error: "Cantitatea trebuie să fie peste zero." };

  const db = await serverDb();
  const { error } = await db.rpc("record_batch", {
    p_sku_key: skuKey,
    p_batch_code: batchCode,
    p_qty: n,
    p_note: str(form, "note") || null,
  });

  if (error) {
    // The function raises in Romanian for the cases a person can fix
    // (insufficient stock, no recipe); anything else is passed through as-is.
    const dup = error.message.includes("production_batches_batch_code_key");
    return { ok: false, error: dup ? `Lotul ${batchCode} există deja.` : error.message };
  }

  revalidatePath("/productie");
  revalidatePath("/stoc");
  return { ok: true, message: `Lot ${batchCode} înregistrat.` };
}
