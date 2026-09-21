import { serverDb } from "@/lib/db";
import { num } from "@/lib/format";
import type {
  Material, MaterialWithStock, SkuCost, Supplier, Sku,
  PurchaseOrder, BomLine, ProductionBatch, StockMove,
} from "@/lib/types";

/**
 * Reads. Every one of them runs as the signed-in user, so RLS decides what
 * comes back — there is no "trust me" path from a page.
 *
 * `stock_on_hand` is a view over the ledger with no foreign key PostgREST can
 * follow, so the join to materials happens here in JS. At a few dozen
 * materials that is cheaper than the machinery to avoid it.
 */

async function onHandBy(field: "material_id" | "sku_id"): Promise<Map<string, number>> {
  const db = await serverDb();
  const { data } = await db.from("stock_on_hand").select(`${field}, qty`).not(field, "is", null);
  const out = new Map<string, number>();
  for (const row of (data ?? []) as Record<string, unknown>[]) {
    out.set(String(row[field]), num(row.qty as string));
  }
  return out;
}

export async function materialsWithStock(): Promise<MaterialWithStock[]> {
  const db = await serverDb();
  const [{ data }, stock] = await Promise.all([
    db.from("materials").select("*, suppliers(name)").order("kind").order("code"),
    onHandBy("material_id"),
  ]);
  return ((data ?? []) as Material[]).map((m) => ({ ...m, on_hand: stock.get(m.id) ?? 0 }));
}

export async function skuCosts(): Promise<SkuCost[]> {
  const db = await serverDb();
  const { data } = await db.from("sku_cost").select("*").order("key");
  return (data ?? []) as SkuCost[];
}

export async function skus(): Promise<Sku[]> {
  const db = await serverDb();
  const { data } = await db.from("skus").select("*").eq("active", true).order("key");
  return (data ?? []) as Sku[];
}

export async function suppliers(): Promise<Supplier[]> {
  const db = await serverDb();
  const { data } = await db.from("suppliers").select("*").order("name");
  return (data ?? []) as Supplier[];
}

export async function purchaseOrders(): Promise<PurchaseOrder[]> {
  const db = await serverDb();
  const { data } = await db
    .from("purchase_orders")
    .select("*, suppliers(name)")
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []) as PurchaseOrder[];
}

export async function bomFor(skuId: string): Promise<BomLine[]> {
  const db = await serverDb();
  const { data } = await db
    .from("bom_lines")
    .select("*, materials(code, name, unit, unit_cost_cents)")
    .eq("sku_id", skuId);
  return (data ?? []) as BomLine[];
}

export async function recentBatches(limit = 25): Promise<ProductionBatch[]> {
  const db = await serverDb();
  const { data } = await db
    .from("production_batches")
    .select("*, skus(key, name, accent)")
    .order("produced_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as ProductionBatch[];
}

/** Every ledger row that carries a lot code — the traceability lookup. */
export async function movesForRef(ref: string): Promise<(StockMove & {
  materials?: { code: string; name: string; unit: string } | null;
  skus?: { key: string; name: string } | null;
})[]> {
  const db = await serverDb();
  const { data } = await db
    .from("stock_moves")
    .select("*, materials(code, name, unit), skus(key, name)")
    .eq("ref", ref)
    .order("id");
  return (data ?? []) as never;
}

export async function poLines(poId: string): Promise<{
  id: string;
  material_id: string;
  qty: string;
  unit_cost_cents: string;
  materials?: { code: string; name: string; unit: string } | null;
}[]> {
  const db = await serverDb();
  const { data } = await db
    .from("purchase_order_lines")
    .select("*, materials(code, name, unit)")
    .eq("purchase_order_id", poId);
  return (data ?? []) as never;
}

// --- CRM --------------------------------------------------------------------

export async function companies(): Promise<import("@/lib/types").Company[]> {
  const db = await serverDb();
  const { data } = await db.from("companies").select("*").order("name");
  return (data ?? []) as never;
}

export async function contacts(): Promise<import("@/lib/types").Contact[]> {
  const db = await serverDb();
  const { data } = await db.from("contacts").select("*, companies(name)").order("name");
  return (data ?? []) as never;
}

export async function deals(): Promise<import("@/lib/types").Deal[]> {
  const db = await serverDb();
  const { data } = await db
    .from("deals")
    .select("*, companies(name, city)")
    .order("created_at", { ascending: false });
  return (data ?? []) as never;
}

export async function deal(id: string): Promise<import("@/lib/types").Deal | null> {
  const db = await serverDb();
  const { data } = await db
    .from("deals")
    .select("*, companies(name, city)")
    .eq("id", id)
    .maybeSingle();
  return (data ?? null) as never;
}

export async function pipeline(): Promise<import("@/lib/types").PipelineRow[]> {
  const db = await serverDb();
  const { data } = await db.from("pipeline_by_stage").select("*");
  return (data ?? []) as never;
}

export async function activitiesFor(dealId: string): Promise<import("@/lib/types").Activity[]> {
  const db = await serverDb();
  const { data } = await db
    .from("activities")
    .select("*, contacts(name)")
    .eq("deal_id", dealId)
    .order("at", { ascending: false });
  return (data ?? []) as never;
}
