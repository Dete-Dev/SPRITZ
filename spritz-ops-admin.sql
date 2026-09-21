-- ---------------------------------------------------------------------------
-- spritz-ops — dă-ți acces.
--
-- A avea cont NU înseamnă acces. Accesul înseamnă un rând în public.profiles;
-- fără el, `is_staff()` returnează false și nu vezi nimic, oricât de valid ar
-- fi tokenul. Rulează asta în Supabase → SQL Editor.
--
-- ÎNAINTE: intră pe /login și cere codul măcar o dată. Asta creează rândul în
-- auth.users. Fără el nu are pe cine promova și blocul dă eroare intenționat.
-- ---------------------------------------------------------------------------

-- === 1. Promovează-te admin ================================================
-- Varianta fără editare: promovează singurul cont existent (primul creat).

do $$
declare
  v_id    uuid;
  v_email text;
begin
  select id, email into v_id, v_email
  from auth.users
  order by created_at
  limit 1;

  if v_id is null then
    raise exception
      'auth.users e gol. Cere întâi codul de pe /login, apoi rulează asta din nou.';
  end if;

  insert into public.profiles (id, email, role)
  values (v_id, v_email, 'admin')
  on conflict (id) do update set role = 'admin';

  raise notice 'Acum % este admin.', v_email;
end $$;


-- === 2. Verifică ===========================================================
-- Trebuie să vezi cel puțin un rând, cu emailul tău și rolul admin.

select email, role, created_at
from public.profiles
order by created_at;


-- ---------------------------------------------------------------------------
-- === 3. Adaugă un coleg (opțional) =========================================
-- Cere-i întâi să intre pe /login și să ceară codul, apoi schimbă emailul de
-- mai jos și rulează doar acest bloc. Rolul: 'staff' sau 'admin'.
-- ---------------------------------------------------------------------------

-- do $$
-- declare
--   v_email text := 'admin@spritzperfumes.com';   -- <<< schimbă
--   v_role  text := 'staff';             -- 'staff' sau 'admin'
--   v_id    uuid;
-- begin
--   select id into v_id from auth.users where lower(email) = lower(v_email);
--
--   if v_id is null then
--     raise exception
--       'Nu există cont pentru %. Cere-i să intre pe /login și să ceară codul.', v_email;
--   end if;
--
--   insert into public.profiles (id, email, role)
--   values (v_id, v_email, v_role)
--   on conflict (id) do update set role = excluded.role;
-- end $$;
