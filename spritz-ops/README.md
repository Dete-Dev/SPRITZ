# spritz-ops

CRM + ERP intern pentru SPRITZ. Aplicație separată, bază de date separată,
în același repo cu `spritz-site/` și `spritz-shopify-app/`.

Shopify rămâne canalul de vânzare. `spritz-ops` e sursa de adevăr pentru ce
Shopify nu ține: rețeta fiecărui parfum, stocul de materii prime, furnizorii,
costul real per sticlă, numărul de lot, și pipeline-ul B2B.

## Pornire

```bash
npm install
cp .env.local.example .env.local   # completează cheile Supabase
npm run dev                        # http://localhost:4100
```

Portul e 4100 ca să poată rula în paralel cu storefront-ul, care e pe 4000.

## Designul e vendorit, nu copiat

Aceiași tokeni, aceleași fonturi, aceleași elemente vandal, aceleași animații
ca site-ul. `scripts/sync-ds.mjs` copiază `app/tokens/`, primitivele din
`components/ui/`, `Reveal`, `SmoothScroll` și `lib/motion.ts` din
`../spritz-site`.

```bash
npm run sync-ds              # aduce ultima versiune
node scripts/sync-ds.mjs --check   # rulează automat în prebuild
```

Fișierele vendorite au un banner „do not edit here". Se editează în
`spritz-site`, apoi se re-sincronizează. `--check` pică build-ul dacă copia e
veche — fără el, cele două aplicații divergează pe culori și nimeni nu observă.

Singura rescriere pe care o face vendorul: `Link` din next-intl devine `Link`
din `next/link`, pentru că ops-ul e într-o singură limbă.

## Accesul

Auth e magic link prin Supabase. **A avea sesiune nu înseamnă acces** — accesul
înseamnă un rând în `profiles`. Rândurile se adaugă manual. Un străin care
obține un token vede zero, pentru că fiecare politică RLS trece prin
`is_staff()`.

### Bootstrap, o singură dată

1. **Dashboard → Authentication → URL Configuration.**
   Site URL `http://localhost:4100`, iar la Redirect URLs adaugă
   `http://localhost:4100/**`. Fără asta linkul din email te trimite pe
   `localhost:3000` — Supabase ignoră orice redirect care nu e pe listă.
2. `npm run dev`, deschizi `/login`, ceri linkul. Asta creează rândul în
   `auth.users`. Încă nu ai acces — nu ai profil.
3. Rulezi în SQL Editor:

```sql
-- Promovează primul cont creat. Rulat de două ori nu strică nimic.
-- Blocul există ca să DEA EROARE când nu are pe cine promova: un simplu
-- `insert ... select ... from auth.users` pe un tabel gol inserează zero
-- rânduri și Supabase raportează "Success. No rows returned.", care arată
-- exact ca o reușită. A costat o rundă de depanare.
do $$
declare v_users integer;
begin
  select count(*) into v_users from auth.users;
  if v_users = 0 then
    raise exception 'auth.users e gol — cere întâi linkul de pe /login.';
  end if;
  insert into public.profiles (id, email, role)
  select id, email, 'admin' from auth.users order by created_at limit 1
  on conflict (id) do update set role = 'admin';
end $$;

select email, role from public.profiles;   -- trebuie să vezi un rând
```

4. Deschizi linkul din email. Ajungi pe panou.

Pentru restul echipei: le ceri să intre pe `/login`, apoi le adaugi profilul
cu `role = 'staff'`.

## Bazele de date

Migrațiile sunt în `supabase/migrations/`, în ordine. Se aplică cu
`npx supabase db push` (cere `supabase login` + `link`) sau lipite în SQL
Editor. `npm run db:bundle` le scoate pe toate la rând, pentru un singur paste.

`0004_seed_skus.sql` e **generată**, nu scrisă de mână:

```bash
npm run seed:skus     # citeste ../spritz-site/lib/scents.ts, rescrie migrația
```

Catalogul are o singură sursă de adevăr și aia e `scents.ts` — e din ce
randează magazinul. Retastarea celor 22 de nume în SQL ar crea a doua sursă,
iar cele două ar începe să difere la prima etichetă schimbată.

## Deploy

Production: **https://spritz-ops.vercel.app** (proiect Vercel `spritz-ops`).

```bash
vercel --prod --yes
```

Variabilele `NEXT_PUBLIC_SUPABASE_*` sunt setate pe toate trei mediile.
`SUPABASE_SERVICE_ROLE_KEY` încă nu — o cere abia P1 (webhook-ul Shopify).

Două lucruri care nu sunt evidente:

- **`.vercelignore` scoate `supabase/` și `tests/`** din upload. Migrațiile nu
  se aplică de pe serverul de build și testele nu rulează acolo.
- **`sync-ds.mjs --check` se dezactivează singur pe serverul de build.** Acolo
  se încarcă doar `spritz-ops/`, deci `../spritz-site` nu există și nu are cu ce
  compara. Copia vendorită *este* ce se publică. Verificarea rămâne strictă
  local, unde chiar poate prinde o divergență.
- **Orice domeniu nou trebuie adăugat la Redirect URLs în Supabase**, altfel
  linkul magic trimite utilizatorul pe Site URL în loc de unde a cerut.

## Verificare

```bash
npm test          # node --test, fără framework
npx tsc --noEmit
npm run build
```

## Unde e planul

`~/.claude/plans/abundant-discovering-wall.md` — fazele, modelul de date, și ce
e lăsat deoparte deliberat.

## Stadiu

- [x] **P0** schelet: Next.js, design system vendorit, Supabase, auth, RLS, shell
- [ ] **P1** catalog + sincronizare Shopify (are nevoie de o aplicație custom cu
      scope-uri Admin: `read_orders`, `read_products`, `read_customers`,
      `read_inventory` — cea existentă e doar Storefront)
- [x] **P2** ERP: materiale, furnizori, aprovizionare, BOM, șarje, cost, loturi
      — migrațiile 0002–0004, ecranele Stoc / Producție / Aprovizionare
- [x] **P3** CRM: companii, contacte, pipeline, activități — migrația 0005, ecranul CRM
- [ ] **P4** rapoarte și alerte
