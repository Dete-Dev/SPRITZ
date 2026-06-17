# SPRITZ — Checklist de lansare

Ordinea exactă, de la zero la prima comandă reală. Detaliile tehnice complete
sunt în [README-shopify.md](README-shopify.md) (store + produse) și
[../spritz-shopify-app/README.md](../spritz-shopify-app/README.md) (Function-ul
de bundle) — acest fișier e doar firul cronologic.

---

## Faza 0 — Azi, fără store (5 min)

Singurul feature care merge complet fără Shopify: AI scent finder-ul.

- [ ] Cheie API de la https://console.anthropic.com/settings/keys
- [ ] `cp .env.local.example .env.local` (dacă nu există deja) și completează
      `ANTHROPIC_API_KEY=sk-ant-...`
- [ ] Restart `npm run dev`

**Verificare:** home → secțiunea „Consilierul" → alege chips → primești o
recomandare cu explicație. Fără cheie, secțiunea cade elegant pe „cele cinci".

## Faza 1 — Store-ul Shopify (~30 min)

Pașii detaliați: [README-shopify.md](README-shopify.md) §1–3.

- [ ] Cont Shopify Partner (gratuit) → **development store** (gratuit cât dezvolți)
- [ ] Custom app `SPRITZ Storefront`: Settings → Apps → Develop apps →
      Create app → bifează toate scope-urile `unauthenticated_*` → Install
- [ ] Copiază Storefront API access token
- [ ] În `.env.local`:
      `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=<store>.myshopify.com` și
      `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=<token>` → restart dev

**Verificare:** butonul de pe pagina de produs nu mai zice „Magazinul se
deschide curând" (dar dă eroare la click până există produsele — normal).

## Faza 2 — Produsele (~30 min)

Tabelul cu titluri exacte și prețuri: [README-shopify.md](README-shopify.md) §4.

- [ ] Creează cele 5 produse (vendor SPRITZ, type Eau de Parfum, variantă 50ml)
- [ ] Upload imaginile din `public/images/scents/<key>/hero.webp`
- [ ] Produsele pe **Active** + inventory setat (sau tracking off la început)
- [ ] Copiază variant ID-ul fiecăruia ca GID
      (`gid://shopify/ProductVariant/...`) în `lib/scents.ts` →
      `shopifyVariantId`

**Verificare:** pagina unui parfum → Adaugă în sacoșă → drawer-ul se deschide
cu produsul → Finalizează → checkout-ul hostat Shopify cu produsul în coș.

## Faza 3 — Function-ul de bundle (~20 min)

Runbook complet cu mutația exactă:
[../spritz-shopify-app/README.md](../spritz-shopify-app/README.md).

- [ ] `npm install -g @shopify/cli@latest`
- [ ] În `spritz-shopify-app/`: `npm install` → `shopify app config link`
- [ ] `shopify app deploy` (dacă CLI-ul respinge config-ul, vezi nota de
      migrare API din README — regenerezi template-ul și porți `run.ts`)
- [ ] Rulează mutația `discountAutomaticAppCreate` cu metafield-ul
      `spritz.tiers` (copy-paste din README §3)
- [ ] Decide: reducerea de bundle se aplică și liniilor cu abonament?
      (`INCLUDE_SUBSCRIPTION_LINES` în `run.ts` — acum `true`)

**Verificare:** /shop → 2 sticle în sacoșă → în drawer apare rândul
„Reducere" cu −10%. Repetă cu 3 (−15%) și 5 (−20%).

## Faza 4 — Apps (~30 min; pot aștepta și după lansare)

- [ ] **Shopify Payments** + Shop Pay + Apple/Google Pay
      (Settings → Payments) — fără cod, apar direct pe checkout
- [ ] **Appstle Subscriptions** (gratuit sub $500/lună): instalează, creează
      un selling plan (ex. livrare lunară −10%) și atașează-l celor 5 produse
      → radio-urile „O singură dată / Abonament" apar **automat** pe paginile
      de produs, fără nicio modificare de cod
- [ ] **GoAffPro** ($49/lună Premium): tiers de comision (ex. 10% → 15% →
      20% după volum), payout PayPal; afiliații primesc link + cod propriu
- [ ] **Klaviyo** (gratuit sub 250 contacte): conectezi store-ul, activezi
      flows de bază (order confirmation e oricum din Shopify)

**Verificare Appstle:** pagina unui parfum → apar cele două opțiuni → adaugi
cu abonament → în drawer apare badge-ul „Abonament · <numele planului>".

## Faza 5 — Go live

- [ ] Activează store-ul pe plan **Basic** ($39/lună)
- [ ] Domeniu custom: Shopify admin → Settings → Domains + DNS la registrar
- [ ] Deploy frontend (Vercel sau echivalent) cu TOATE env vars setate acolo:
      `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`,
      `ANTHROPIC_API_KEY`
- [ ] `npm run build` local trece înainte de deploy
- [ ] Test cap-coadă în producție: comandă reală cu cardul tău (bundle de 2,
      din care unul cu abonament) → verifici emailul de confirmare → refund

## Recap costuri lunare la lansare

| Serviciu | Cost |
|---|---|
| Shopify Basic | $39 |
| GoAffPro Premium | $49 |
| Appstle | $0 (sub $500/lună abonamente) |
| Klaviyo | $0 (sub 250 contacte) |
| Bundle Function | $0 (cod propriu) |
| Claude API (finder) | ~$5–20, pe consum |
| **Total** | **~$90–110/lună** |
