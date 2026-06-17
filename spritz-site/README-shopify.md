# Headless Shopify — Setup pentru SPRITZ

Integrarea Storefront API e deja scrisă în codbase. Tu trebuie doar să creezi
store-ul, să iei tokenii, să creezi produsele și să mapezi variantele.

---

## 1. Creează store-ul Shopify (≈10 min)

1. https://www.shopify.com/partners — creezi cont Partner gratuit.
2. Partner Dashboard → Stores → **Add store** → Development store (gratis cât
   timp dezvolți, plătești doar la activare).
3. Plan: **Basic Shopify** ($39 / lună) e suficient pentru lansare. Poți
   activa store-ul cu acest plan când vrei să mergi live.

## 2. Creează un Custom App pentru Storefront API (≈5 min)

În Shopify admin:

1. **Settings → Apps and sales channels → Develop apps**.
   Dacă nu apare „Develop apps", click „Allow custom app development".
2. **Create an app** → numește-l `SPRITZ Storefront`.
3. Tab **Configuration → Storefront API access scopes** → bifează toate
   scope-urile cu prefix `unauthenticated_*` (read products, read collections,
   write checkouts, read inventory etc.).
4. **Install app**.
5. Tab **API credentials → Storefront API access tokens** → copiezi
   *Storefront API access token*. **Acesta e tokenul public**, e safe să-l pui
   în `NEXT_PUBLIC_*`.

## 3. Pune credentialele în `.env.local`

```bash
cp .env.local.example .env.local
```

Apoi în `.env.local`:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=numele-store-ului.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=<tokenul copiat la pasul 2.5>
```

`npm run dev` — cart-ul ar trebui să răspundă acum (deși fără produse încă).

## 4. Creează cele 5 produse în Shopify admin

În `Products → Add product`, pentru fiecare scent:

| Scent | Title | Vendor | Type |
|---|---|---|---|
| ananas | voile d'ananas et bouleau | SPRITZ | Eau de Parfum |
| cerise | voile de cerise et rose | SPRITZ | Eau de Parfum |
| menthe | bois de cèdre et menthe | SPRITZ | Eau de Parfum |
| safran | essence de safran et ambre | SPRITZ | Eau de Parfum |
| truffe | nuit de truffe et chocolat | SPRITZ | Eau de Parfum |

Pentru fiecare:
- **Pricing**: 420 / 420 / 420 / 460 / 480 RON (sau ce ai în `lib/scents.ts`).
- **Media**: upload imaginea din `public/images/scents/<key>/hero.webp`.
- **Variants**: doar `50ml` deocamdată. Adaugă travel size 5ml mai târziu.
- **SEO**: title + meta description din `messages/{locale}.json`.

După create, deschide fiecare produs și ia **variant ID** (GID format):

- URL-ul variant arată ca:
  `…/admin/products/9876543210/variants/4567890123456`
- GID-ul pe care îl pui în cod e:
  `gid://shopify/ProductVariant/4567890123456`

## 5. Pune variant IDs în `lib/scents.ts`

```ts
{
  key: "ananas",
  // ...
  shopifyVariantId: "gid://shopify/ProductVariant/4567890123456",
},
```

Reload `/scents/ananas` → butonul „Add to bag" funcționează → drawer se
deschide → click „Checkout" → te redirectează la checkout-ul hostat
Shopify cu produsul în coș.

## 6. (Optional) Configurare Shop Pay + Apple/Google Pay

În Shopify admin → **Settings → Payments**:
- Activate **Shopify Payments** (default Stripe-equivalent).
- Activate **Shop Pay** (cumpărători returning checkout în 3 secunde).
- Activate **Apple Pay** și **Google Pay** (automat dacă ai Shopify Payments).

Acestea apar pe checkout fără nicio modificare de cod.

## 7. (Optional) Subscriptions, Referrals, Mystery Box — apps

Toate sunt apps din Shopify App Store. Se conectează la magazinul tău,
nu necesită cod custom (sau foarte puțin):

| Funcție | App recomandată | Cost / lună |
|---|---|---|
| Subscriptions (Discovery / Replenish) | **Recharge** sau **Stay AI** | $60–$120 |
| Referral program | **Smile.io** sau **Friendbuy** | $29–$59 |
| Bundle 5+1, 3+1 | **Bold Bundles** sau Shopify Functions (free) | $20–$40 |
| Mystery box (random fulfillment) | SKU manual + Shopify Flow | $0 |
| Email transactional + flows | **Klaviyo** | $0 până la 250 contacte |

Adaugi pe rând după lansare — codul curent e indiferent la prezența lor.

## 8. Live: connect domain custom

Când ești gata:

1. Shopify admin → **Settings → Domains** → add `sprtiz.ro` (sau ce vrei).
2. DNS la registrar:
   - `A` record la `23.227.38.32` (Shopify) — DOAR pentru pages servite de
     Shopify (checkout).
   - Frontend-ul Next.js rămâne pe Vercel/where-you-deploy.
3. Pentru checkout custom domain: configurabil în Shopify Plus, sau redirect
   `checkout.sprtiz.ro` → checkout Shopify.

---

## Cum funcționează integrarea în cod (pentru referință)

```
.env.local                          # tokens
lib/shopify/
├── client.ts                       # singleton client
├── queries.ts                      # GraphQL strings (CART_FRAGMENT, cartCreate, etc.)
├── types.ts                        # narrow Cart / CartLine / Money types
└── cart.ts                         # cartCreate / cartLinesAdd / cartLinesUpdate / cartLinesRemove

components/cart/
├── CartProvider.tsx                # React context. Persists cartId in localStorage.
├── CartButton.tsx                  # Header pill with item count.
├── CartDrawer.tsx                  # Sliding right-side drawer.
└── AddToCartButton.tsx             # Product page CTA.

lib/scents.ts                       # `shopifyVariantId` field per scent.
```

Flow:
1. User loads page → CartProvider tries to rehydrate from `localStorage`.
2. Click "Add to bag" → `cartCreate` if no cart yet, else `cartLinesAdd`.
3. Drawer auto-opens. Subtotal shown.
4. Click "Checkout" → redirect la `cart.checkoutUrl` (hosted Shopify).
5. Plata, livrarea, tax-ul — toate gestionate de Shopify.
6. Order confirmation → email via Shopify Notifications (configurat în admin).
7. Cart ID rămâne în localStorage → user-ul poate reveni cu coșul intact.

## Troubleshooting

**Butonul rămâne pe „Store launching soon" chiar și după ce am setat env vars.**
- Verifică că ai numit corect variabilele: `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
  și `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`.
- Restart-ează `npm run dev` după ce modifici `.env.local`.
- Variabila DOMAIN nu trebuie să conțină `https://`, doar `xxx.myshopify.com`.

**Add to bag dă „Could not add to cart".**
- Verifică că `shopifyVariantId` are formatul `gid://shopify/ProductVariant/…`.
- Verifică în Shopify admin că produsul e Active (nu Draft) și că varianta
  are inventory > 0 (sau setezi „Track inventory: off" la lansare).

**Checkout redirect → 404.**
- Înseamnă că `cart.checkoutUrl` nu se primește. De obicei e o problemă cu
  scope-uri lipsă pe Storefront API app. Re-verifică toate scope-urile
  `unauthenticated_write_checkouts` etc.
