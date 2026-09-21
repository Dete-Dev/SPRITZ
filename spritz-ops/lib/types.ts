/**
 * Row shapes, hand-written.
 *
 * Supabase can generate these from the schema, but that needs `supabase login`
 * and a linked project. Twelve tables is not enough to be worth the setup —
 * revisit if the schema grows past what one file can hold.
 *
 * `numeric` columns are typed `string` because that is genuinely what arrives.
 * Run them through `num()` in lib/format.ts.
 */

export type Role = "admin" | "staff";

export type Profile = { id: string; email: string; name: string | null; role: Role };

export type Sku = {
  id: string;
  key: string;
  name: string;
  inspired_by: string | null;
  family: string | null;
  accent: string | null;
  size: string;
  price_cents: number;
  shopify_variant_id: string | null;
  active: boolean;
};

export type SkuCost = {
  id: string;
  key: string;
  name: string;
  accent: string | null;
  price_cents: number;
  cost_cents: string;
  margin_cents: string;
  line_count: number | null;
  on_hand: string | null;
};

export type Supplier = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  lead_time_days: number | null;
};

export type MaterialKind =
  | "concentrate" | "alcohol" | "bottle" | "cap" | "label" | "box" | "other";

export type Material = {
  id: string;
  code: string;
  name: string;
  kind: MaterialKind;
  unit: "ml" | "g" | "buc";
  unit_cost_cents: string;
  reorder_point: string;
  supplier_id: string | null;
  suppliers?: { name: string } | null;
};

/** A material joined to its running total. `on_hand` is null when it has never moved. */
export type MaterialWithStock = Material & { on_hand: number };

export type StockMove = {
  id: number;
  item_type: "material" | "sku";
  material_id: string | null;
  sku_id: string | null;
  qty: string;
  reason: "purchase" | "production" | "sale" | "adjustment";
  ref: string | null;
  note: string | null;
  created_at: string;
};

export type PurchaseOrder = {
  id: string;
  code: string;
  supplier_id: string;
  status: "draft" | "sent" | "received" | "cancelled";
  expected_at: string | null;
  received_at: string | null;
  suppliers?: { name: string } | null;
};

export type BomLine = {
  sku_id: string;
  material_id: string;
  qty_per_unit: string;
  materials?: Pick<Material, "code" | "name" | "unit" | "unit_cost_cents"> | null;
};

export type ProductionBatch = {
  id: string;
  sku_id: string;
  batch_code: string;
  qty: string;
  unit_cost_cents: string;
  produced_at: string;
  note: string | null;
  skus?: Pick<Sku, "key" | "name" | "accent"> | null;
};

// --- CRM --------------------------------------------------------------------

export type CompanyType = "retail" | "salon" | "corporate" | "other";

export type Company = {
  id: string;
  name: string;
  type: CompanyType;
  city: string | null;
  vat_id: string | null;
  note: string | null;
};

export type Contact = {
  id: string;
  company_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  companies?: { name: string } | null;
};

export type DealStage = "lead" | "qualified" | "quoted" | "won" | "lost";

export type Deal = {
  id: string;
  company_id: string;
  title: string;
  stage: DealStage;
  value_cents: number;
  expected_close: string | null;
  next_step: string | null;
  next_step_at: string | null;
  lost_reason: string | null;
  created_at: string;
  closed_at: string | null;
  companies?: { name: string; city: string | null } | null;
};

export type Activity = {
  id: string;
  deal_id: string | null;
  contact_id: string | null;
  kind: "call" | "email" | "meeting" | "note";
  body: string;
  at: string;
  contacts?: { name: string } | null;
};

export type PipelineRow = { stage: DealStage; deals: number; value_cents: string };
