# spritz-shopify-app — Bundle tier discount Function

Custom Shopify app care ține **Function-ul de discount pe tier-uri**:
2 sticle → −10%, 3 → −15%, 5 → −20% (peste tot coșul, indiferent de combinație).

Codul e scris de mână în structura pe care o produce `shopify app init`.
**Nu poate fi deployat până nu există store-ul** — urmează runbook-ul de mai jos
când ești gata.

## Structură

```
shopify.app.toml                       # config app (client_id se completează la link)
extensions/bundle-discount/
  shopify.extension.toml               # extensie de tip function (product discount)
  src/run.graphql                      # input: liniile coșului + metafield spritz.tiers
  src/run.ts                           # logica de tier (portabilă între template-uri)
```

## De unde vin tier-urile (două locuri — ține-le sincronizate!)

| Loc | Rol |
|---|---|
| Metafield `spritz.tiers` pe discount node | **Adevărul** la checkout. Editabil din admin fără redeploy. |
| `FALLBACK_TIERS` în `src/run.ts` | Fallback dacă metafield-ul lipsește / e corupt. |
| `spritz-site/lib/bundle.ts` | Estimatul afișat în UI pe /shop. |

Când schimbi procentele: actualizează metafield-ul (mutația de mai jos),
`FALLBACK_TIERS`, și `BUNDLE_TIERS` din site.

## Runbook de deploy (după ce există store-ul)

### 1. Pregătire

```bash
npm install -g @shopify/cli@latest
cd spritz-shopify-app
npm install
```

### 2. Link + deploy

```bash
shopify app config link    # login Partner, creează/leagă app-ul, scrie client_id
shopify app deploy         # push extensia function
```

> **Atenție la migrarea API**: Shopify mută discount Functions de pe
> `product_discounts` (target `purchase.product-discount.run`) pe API-ul
> unificat (`cartLinesDiscountsGenerateRun`). Dacă deploy-ul respinge
> config-ul, regenerează cu template-ul curent:
> `shopify app generate extension --template discount_function`
> și portează logica din `src/run.ts` (e agnostică de template).
> Rulează și `npm run typegen` ca să înlocuiești tipurile scrise de mână
> cu cele generate din schema reală.

### 3. Activare — creează discountul automat

În **Admin API GraphiQL** (app Shopify GraphiQL sau `shopify app dev`),
rulează (înlocuiește `FUNCTION_ID` — îl vezi în output-ul de la deploy sau în
Partner Dashboard → App → Extensions):

```graphql
mutation {
  discountAutomaticAppCreate(automaticAppDiscount: {
    title: "SPRITZ bundle"
    functionId: "FUNCTION_ID"
    startsAt: "2026-06-01T00:00:00Z"
    combinesWith: { productDiscounts: false, orderDiscounts: false, shippingDiscounts: true }
    metafields: [{
      namespace: "spritz"
      key: "tiers"
      type: "json"
      value: "[{\"minQuantity\":2,\"percentOff\":10},{\"minQuantity\":3,\"percentOff\":15},{\"minQuantity\":5,\"percentOff\":20}]"
    }]
  }) {
    automaticAppDiscount { discountId }
    userErrors { field message }
  }
}
```

Ca să schimbi tier-urile mai târziu fără redeploy: `metafieldsSet` pe
discount node-ul returnat mai sus, același namespace/key/type.

### 4. Test

1. Pe site, /shop → adaugă 2 sticle → drawer: apare rândul "Reducere" cu −10%
   (frontend-ul citește `discountAllocations` — deja implementat).
2. Repetă cu 3 (−15%) și 5 (−20%).
3. Checkout → reducerea apare și pe pagina Shopify de checkout.

## Fallback interimar fără Function (opțional, zero cod)

Un **discount automat nativ** din admin (Amount off products, minimum
quantity 3 → 15%) acoperă UN singur tier, fără tiered behavior. Bun ca
stopgap la lansare. **Dezactivează-l înainte să activezi Function-ul** —
altfel se bat cap în cap (un singur discount automat se aplică per comandă).

## Decizie de business de confirmat la deploy

`INCLUDE_SUBSCRIPTION_LINES` în `src/run.ts` e `true`: liniile cu abonament
contează la tier și primesc și ele reducerea de bundle (peste reducerea de
abonament). Dacă nu vrei stacking, pune `false`.
