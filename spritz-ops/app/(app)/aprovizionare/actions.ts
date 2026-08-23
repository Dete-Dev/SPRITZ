"use server";

import { revalidatePath } from "next/cache";
import { serverDb } from "@/lib/db";

/**
 * Suppliers and purchase orders.
 *
 * Receiving calls the `receive_purchase_order` database function rather than
 * writing the ledger rows here: it posts one stock move per line, updates the
 * standard cost and flips the status, and all three have to land together.
 */

export type Result = { ok: true; message?: string } | { ok: false; error: string };

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

function amount(raw: string): number | null {
  const n = Number(raw.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export async function addSupplier(_prev: Result | null, form: FormData): Promise<Result> {
  const name = str(form, "name");
  if (!name) return { ok: false, error: "Numele e obligatoriu." };

  const leadRaw = str(form, "lead_time_days");
  const lead = leadRaw ? amount(leadRaw) : null;
  if (leadRaw && (lead === null || lead < 0)) {
    return { ok: false, error: "Termenul de livrare trebuie să fie un număr de zile." };
  }

  const db = await serverDb();
  const { error } = await db.from("suppliers").insert({
    name,
    email: str(form, "email") || null,
    phone: str(form, "phone") || null,
    lead_time_days: lead,
  });

  if (error) {
    return { ok: false, error: error.code === "23505" ? `${name} există deja.` : error.message };
  }
  revalidatePath("/aprovizionare");
  return { ok: true };
}

export async function createPurchaseOrder(_prev: Result | null, form: FormData): Promise<Result> {
  const code = str(form, "code");
  const supplierId = str(form, "supplier_id");
  if (!code) return { ok: false, error: "Codul comenzii e obligatoriu." };
  if (!supplierId) return { ok: false, error: "Alege furnizorul." };

  const db = await serverDb();
  const { error } = await db.from("purchase_orders").insert({
    code,
    supplier_id: supplierId,
    expected_at: str(form, "expected_at") || null,
    note: str(form, "note") || null,
  });

  if (error) {
    return { ok: false, error: error.code === "23505" ? `Comanda ${code} există deja.` : error.message };
  }
  revalidatePath("/aprovizionare");
  return { ok: true };
}

export async function addLine(_prev: Result | null, form: FormData): Promise<Result> {
  const poId = str(form, "purchase_order_id");
  const materialId = str(form, "material_id");
  const q = amount(str(form, "qty"));
  const cost = amount(str(form, "unit_cost_cents"));

  if (!poId || !materialId) return { ok: false, error: "Alege materialul." };
  if (q === null || q <= 0) return { ok: false, error: "Cantitatea trebuie să fie peste zero." };
  if (cost === null || cost < 0) return { ok: false, error: "Costul nu e un număr valid." };

  const db = await serverDb();
  const { error } = await db
    .from("purchase_order_lines")
    .upsert(
      { purchase_order_id: poId, material_id: materialId, qty: q, unit_cost_cents: cost },
      { onConflict: "purchase_order_id,material_id" },
    );

  if (error) return { ok: false, error: error.message };
  revalidatePath("/aprovizionare");
  return { ok: true };
}

export async function receive(_prev: Result | null, form: FormData): Promise<Result> {
  const poId = str(form, "purchase_order_id");
  if (!poId) return { ok: false, error: "Comandă necunoscută." };

  const db = await serverDb();
  const { error } = await db.rpc("receive_purchase_order", { p_po: poId });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/aprovizionare");
  revalidatePath("/stoc");
  return { ok: true, message: "Recepționat. Stocul a crescut." };
}
