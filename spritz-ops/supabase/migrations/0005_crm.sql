-- ---------------------------------------------------------------------------
-- spritz-ops P3 — the CRM.
--
-- Shopify records the order. It does not record the six weeks of talking to a
-- salon in Cluj that came before it, and that conversation is the whole B2B
-- business. This is where that lives.
--
-- Phones are stored E.164 and only E.164 (lib/phone.ts normalises on the way
-- in), because the platform deduplicates a person on email first and phone
-- second. Three spellings of one number are three people.
-- ---------------------------------------------------------------------------

create table public.companies (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  type       text not null default 'retail'
               check (type in ('retail', 'salon', 'corporate', 'other')),
  city       text,
  vat_id     text,
  note       text,
  created_at timestamptz not null default now()
);

-- Two salons can share a name in different cities, so the name alone is not
-- the key — but the same name in the same city almost certainly is a duplicate.
create unique index companies_name_city_idx
  on public.companies (lower(name), lower(coalesce(city, '')));

create table public.contacts (
  id         uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies (id) on delete cascade,
  name       text not null,
  email      text,
  -- E.164 or nothing. The check is the guarantee; the app gives the message.
  phone      text check (phone is null or phone ~ '^\+[1-9][0-9]{7,14}$'),
  role       text,
  note       text,
  created_at timestamptz not null default now()
);

create unique index contacts_email_idx on public.contacts (lower(email)) where email is not null;
create unique index contacts_phone_idx on public.contacts (phone) where phone is not null;
create index contacts_company_idx on public.contacts (company_id);

create table public.deals (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid not null references public.companies (id) on delete cascade,
  title          text not null,
  stage          text not null default 'lead'
                   check (stage in ('lead', 'qualified', 'quoted', 'won', 'lost')),
  value_cents    integer not null default 0 check (value_cents >= 0),
  expected_close date,
  -- The next thing someone has to do, and when. A pipeline without this is a
  -- list of things that quietly went cold.
  next_step      text,
  next_step_at   date,
  lost_reason    text,
  owner_id       uuid references auth.users (id),
  created_at     timestamptz not null default now(),
  closed_at      timestamptz
);

create index deals_company_idx on public.deals (company_id);
create index deals_stage_idx on public.deals (stage);

-- Closing a deal stamps the date without anyone remembering to. Reopening it
-- clears the stamp, so "won in March" cannot survive on a deal that is back in
-- the pipeline.
create or replace function public.deals_stamp_closed()
returns trigger language plpgsql as $$
begin
  if new.stage in ('won', 'lost') and (old is null or old.stage not in ('won', 'lost')) then
    new.closed_at := now();
  elsif new.stage not in ('won', 'lost') then
    new.closed_at := null;
  end if;
  return new;
end;
$$;

create trigger deals_closed_at before insert or update of stage on public.deals
  for each row execute function public.deals_stamp_closed();

create table public.activities (
  id         uuid primary key default gen_random_uuid(),
  deal_id    uuid references public.deals (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete set null,
  kind       text not null check (kind in ('call', 'email', 'meeting', 'note')),
  body       text not null,
  at         timestamptz not null default now(),
  created_by uuid references auth.users (id),
  -- An activity floating free of both a deal and a contact is orphaned data
  -- nobody will ever find again.
  constraint activities_attached check (deal_id is not null or contact_id is not null)
);

create index activities_deal_idx on public.activities (deal_id);
create index activities_contact_idx on public.activities (contact_id);

-- --- row level security -----------------------------------------------------

alter table public.companies  enable row level security;
alter table public.contacts   enable row level security;
alter table public.deals      enable row level security;
alter table public.activities enable row level security;

do $$
declare t text;
begin
  foreach t in array array['companies', 'contacts', 'deals', 'activities'] loop
    execute format(
      'create policy "staff manages %1$s" on public.%1$I for all to authenticated
         using (public.is_staff()) with check (public.is_staff())', t);
  end loop;
end $$;

-- --- the pipeline, as one row per stage -------------------------------------

create view public.pipeline_by_stage
with (security_invoker = on) as
select
  stage,
  count(*)              as deals,
  sum(value_cents)      as value_cents
from public.deals
group by stage;
