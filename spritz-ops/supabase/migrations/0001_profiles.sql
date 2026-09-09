-- ---------------------------------------------------------------------------
-- spritz-ops P0 — who is allowed in.
--
-- Auth is Supabase magic link. Anyone who knows a staff email could request a
-- link, so being an authenticated user is NOT the permission — having a row in
-- `profiles` is. Profiles are inserted by hand (or by an admin screen later),
-- never by a signup trigger. A stranger who talks Supabase into issuing them a
-- token still sees nothing, because every policy in this system routes through
-- `is_staff()`.
-- ---------------------------------------------------------------------------

create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null unique,
  name       text,
  role       text not null default 'staff' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

comment on table public.profiles is
  'Staff allowlist. No row means no access, regardless of a valid auth token.';

-- `security definer` so the function can read profiles from inside a policy on
-- profiles itself without recursing through that same policy.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

alter table public.profiles enable row level security;

create policy "staff read profiles"
  on public.profiles for select to authenticated
  using (public.is_staff());

create policy "self updates own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

create policy "admin manages profiles"
  on public.profiles for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
