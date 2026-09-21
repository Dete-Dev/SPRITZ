-- ---------------------------------------------------------------------------
-- spritz-ops P2 — the ERP core.
--
-- One idea holds the whole thing together: STOCK IS NOT A COLUMN, IT IS A SUM.
-- `stock_moves` is append-only and `stock_on_hand` sums it. Mutable counters
-- drift the first time a bug writes one and nobody can say when it started.
-- The ledger is immutable by trigger; a correction is an `adjustment` row, not
-- an edit.
--
-- MONEY. Everything is in CENTS. Prices and totals a human quotes are whole
-- cents, so `integer`. Per-unit material cost is not — a millilitre of alcohol
-- costs a fraction of a cent — so those are `numeric`, which is exact decimal,
-- never float. Round to whole cents only when displaying.
-- ---------------------------------------------------------------------------

-- --- catalogue --------------------------------------------------------------

create table public.skus (
  id                 uuid primary key default gen_random_uuid(),
  key                text not null unique,
  name               text not null,
  inspired_by        text,
  family             text,
  -- The colour sampled from the printed label stripe. An ERP row shows the
  -- same stripe as the shop card, so a picker recognises the bottle.
  accent             text,
  size               text not null default '50ml',
  price_cents        integer not null check (price_cents >= 0),
  shopify_product_id text,
  shopify_variant_id text,
  active             boolean not null default true,
  created_at         timestamptz not null default now()
);

comment on table public.skus is
  'The 22 finished perfumes. Seeded from spritz-site/lib/scents.ts, which stays the catalogue source of truth.';

-- --- supply -----------------------------------------------------------------

create table public.suppliers (
  id              uuid primary key default gen_random_uuid(),
  name            text not null unique,
  email           text,
  phone           text,
  lead_time_days  integer check (lead_time_days >= 0),
  note            text,
  created_at      timestamptz not null default now()
);

create table public.materials (
  id               uuid primary key default gen_random_uuid(),
  code             text not null unique,
  name             text not null,
  kind             text not null check (kind in
                     ('concentrate', 'alcohol', 'bottle', 'cap', 'label', 'box', 'other')),
  unit             text not null check (unit in ('ml', 'g', 'buc')),
  -- Cents per one `unit`. Fractional on purpose: 1 ml of alcohol is well under
  -- a cent, and rounding it to 0 makes every recipe cost nothing.
  unit_cost_cents  numeric(14, 6) not null default 0 check (unit_cost_cents >= 0),
  reorder_point    numeric(14, 3) not null default 0 check (reorder_point >= 0),
  supplier_id      uuid references public.suppliers (id) on delete set null,
  created_at       timestamptz not null default now()
);

create index materials_supplier_idx on public.materials (supplier_id);

create table public.purchase_orders (
  id           uuid primary key default gen_random_uuid(),
  code         text not null unique,
  supplier_id  uuid not null references public.suppliers (id) on delete restrict,
  status       text not null default 'draft'
                 check (status in ('draft', 'sent', 'received', 'cancelled')),
  expected_at  date,
  received_at  timestamptz,
  note         text,
  created_at   timestamptz not null default now()
);

create table public.purchase_order_lines (
  id                uuid primary key default gen_random_uuid(),
  purchase_order_id uuid not null references public.purchase_orders (id) on delete cascade,
  material_id       uuid not null references public.materials (id) on delete restrict,
  qty               numeric(14, 3) not null check (qty > 0),
  unit_cost_cents   numeric(14, 6) not null check (unit_cost_cents >= 0),
  unique (purchase_order_id, material_id)
);

-- --- recipe -----------------------------------------------------------------

create table public.bom_lines (
  sku_id        uuid not null references public.skus (id) on delete cascade,
  material_id   uuid not null references public.materials (id) on delete restrict,
  qty_per_unit  numeric(14, 4) not null check (qty_per_unit > 0),
  primary key (sku_id, material_id)
);

comment on table public.bom_lines is
  'What one bottle of a SKU consumes. Quantities are in the material''s own unit.';

-- --- production -------------------------------------------------------------

create table public.production_batches (
  id               uuid primary key default gen_random_uuid(),
  sku_id           uuid not null references public.skus (id) on delete restrict,
  -- Printed on every bottle. EU Cosmetics Regulation 1223/2009 requires it to
  -- lead back to what went in, which is what the ledger rows keyed to it do.
  batch_code       text not null unique,
  qty              numeric(14, 3) not null check (qty > 0),
  -- Cost of one bottle AT THE MOMENT OF PRODUCTION. Never recalculated: if it
  -- were, last year's margin would move every time a supplier raises a price.
  unit_cost_cents  numeric(14, 6) not null,
  produced_at      timestamptz not null default now(),
  note             text,
  created_by       uuid references auth.users (id)
);

-- --- the ledger -------------------------------------------------------------

create table public.stock_moves (
  id           bigint generated always as identity primary key,
  item_type    text not null check (item_type in ('material', 'sku')),
  material_id  uuid references public.materials (id) on delete restrict,
  sku_id       uuid references public.skus (id) on delete restrict,
  qty          numeric(14, 3) not null check (qty <> 0),
  reason       text not null check (reason in ('purchase', 'production', 'sale', 'adjustment')),
  -- What caused it: a batch code, a PO code, a Shopify order id.
  ref          text,
  note         text,
  created_at   timestamptz not null default now(),
  created_by   uuid references auth.users (id),
  -- One ledger, two kinds of item, and still a real foreign key on each.
  constraint stock_moves_one_item check (
    (item_type = 'material' and material_id is not null and sku_id is null) or
    (item_type = 'sku'      and sku_id      is not null and material_id is null)
  )
);

create index stock_moves_material_idx on public.stock_moves (material_id) where material_id is not null;
create index stock_moves_sku_idx      on public.stock_moves (sku_id)      where sku_id is not null;
create index stock_moves_ref_idx      on public.stock_moves (ref);

create or replace function public.stock_moves_immutable()
returns trigger language plpgsql as $$
begin
  raise exception
    'stock_moves is append-only. Post an adjustment row instead of editing history.';
end;
$$;

create trigger stock_moves_no_update before update on public.stock_moves
  for each row execute function public.stock_moves_immutable();
create trigger stock_moves_no_delete before delete on public.stock_moves
  for each row execute function public.stock_moves_immutable();

create view public.stock_on_hand
with (security_invoker = on) as
select item_type, material_id, sku_id, sum(qty) as qty
from public.stock_moves
group by item_type, material_id, sku_id;

-- --- row level security -----------------------------------------------------
-- Same gate as profiles: a session is not access, a row in `profiles` is.

alter table public.skus                 enable row level security;
alter table public.suppliers            enable row level security;
alter table public.materials            enable row level security;
alter table public.purchase_orders      enable row level security;
alter table public.purchase_order_lines enable row level security;
alter table public.bom_lines            enable row level security;
alter table public.production_batches   enable row level security;
alter table public.stock_moves          enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'skus', 'suppliers', 'materials', 'purchase_orders',
    'purchase_order_lines', 'bom_lines', 'production_batches', 'stock_moves'
  ] loop
    execute format(
      'create policy "staff manages %1$s" on public.%1$I for all to authenticated
         using (public.is_staff()) with check (public.is_staff())', t);
  end loop;
end $$;
