-- ---------------------------------------------------------------------------
-- spritz-ops P2 — the two operations that must not half-happen.
--
-- Receiving a purchase order and bottling a batch each touch several tables.
-- Doing that from the app means a crash between two statements leaves stock
-- that was consumed but never produced. Both live in the database instead, so
-- each is one transaction and either all of it lands or none of it does.
-- ---------------------------------------------------------------------------

-- --- receiving --------------------------------------------------------------

create or replace function public.receive_purchase_order(p_po uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_code   text;
  v_status text;
begin
  select code, status into v_code, v_status
  from purchase_orders where id = p_po for update;

  if v_code is null then
    raise exception 'purchase order % not found', p_po;
  end if;
  if v_status = 'received' then
    raise exception 'purchase order % is already received', v_code;
  end if;
  if v_status = 'cancelled' then
    raise exception 'purchase order % is cancelled', v_code;
  end if;

  insert into stock_moves (item_type, material_id, qty, reason, ref, created_by)
  select 'material', l.material_id, l.qty, 'purchase', v_code, auth.uid()
  from purchase_order_lines l
  where l.purchase_order_id = p_po;

  if not found then
    raise exception 'purchase order % has no lines', v_code;
  end if;

  -- The price we actually paid becomes the standard cost from here on. Past
  -- batches keep their own snapshot, so nothing historical moves.
  -- ponytail: last-in cost, not weighted average. Swap it if a margin ever
  -- gets argued over — the ledger holds every purchase, so the average is
  -- recoverable after the fact.
  update materials m
  set unit_cost_cents = l.unit_cost_cents
  from purchase_order_lines l
  where l.purchase_order_id = p_po and l.material_id = m.id;

  update purchase_orders
  set status = 'received', received_at = now()
  where id = p_po;
end;
$$;

-- --- bottling ---------------------------------------------------------------

create or replace function public.record_batch(
  p_sku_key    text,
  p_batch_code text,
  p_qty        numeric,
  p_note       text default null
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_sku       uuid;
  v_cost      numeric(14, 6);
  v_batch     uuid;
  v_short     text;
begin
  if p_qty is null or p_qty <= 0 then
    raise exception 'batch quantity must be positive';
  end if;

  select id into v_sku from skus where key = p_sku_key;
  if v_sku is null then
    raise exception 'unknown SKU %', p_sku_key;
  end if;

  if not exists (select 1 from bom_lines where sku_id = v_sku) then
    raise exception 'SKU % has no recipe — add BOM lines before bottling', p_sku_key;
  end if;

  -- Two people bottling at once could both pass the stock check and both
  -- commit, taking the material negative. One global lock removes that; at a
  -- house that bottles in serial it costs nothing.
  -- ponytail: single global production lock, per-material locks if two lines
  -- ever run at the same time.
  perform pg_advisory_xact_lock(hashtext('spritz_ops_production'));

  -- Refuse the whole batch if any one material is short, and say which.
  select string_agg(m.code || ' (are ' || coalesce(oh.qty, 0) || ', trebuie ' || (b.qty_per_unit * p_qty) || ')', ', ')
  into v_short
  from bom_lines b
  join materials m on m.id = b.material_id
  left join stock_on_hand oh on oh.material_id = b.material_id
  where b.sku_id = v_sku
    and coalesce(oh.qty, 0) < b.qty_per_unit * p_qty;

  if v_short is not null then
    raise exception 'stoc insuficient: %', v_short;
  end if;

  select sum(b.qty_per_unit * m.unit_cost_cents)
  into v_cost
  from bom_lines b
  join materials m on m.id = b.material_id
  where b.sku_id = v_sku;

  insert into production_batches (sku_id, batch_code, qty, unit_cost_cents, note, created_by)
  values (v_sku, p_batch_code, p_qty, v_cost, p_note, auth.uid())
  returning id into v_batch;

  insert into stock_moves (item_type, material_id, qty, reason, ref, created_by)
  select 'material', b.material_id, -(b.qty_per_unit * p_qty), 'production', p_batch_code, auth.uid()
  from bom_lines b
  where b.sku_id = v_sku;

  insert into stock_moves (item_type, sku_id, qty, reason, ref, created_by)
  values ('sku', v_sku, p_qty, 'production', p_batch_code, auth.uid());

  return v_batch;
end;
$$;

-- --- what a bottle costs, and what it earns ---------------------------------

create view public.sku_cost
with (security_invoker = on) as
select
  s.id,
  s.key,
  s.name,
  s.accent,
  s.price_cents,
  coalesce(bom.cost_cents, 0)                             as cost_cents,
  s.price_cents - coalesce(bom.cost_cents, 0)             as margin_cents,
  bom.line_count,
  coalesce(oh.qty, 0)                                     as on_hand
from skus s
left join (
  select b.sku_id,
         sum(b.qty_per_unit * m.unit_cost_cents) as cost_cents,
         count(*)                                as line_count
  from bom_lines b
  join materials m on m.id = b.material_id
  group by b.sku_id
) bom on bom.sku_id = s.id
left join stock_on_hand oh on oh.sku_id = s.id;

comment on view public.sku_cost is
  'Live cost from the current recipe and current material prices. Not what a past batch cost — that is production_batches.unit_cost_cents.';
