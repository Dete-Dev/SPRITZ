# SPRITZ

Marketing + commerce site for SPRITZ, a Romanian perfume house selling 22
inspired-by ("dupe") eau de parfum at EUR 100. Headless Shopify storefront
with a street-leaning, motion-driven front end.

## Monorepo layout

| Path | What it is |
|---|---|
| `spritz-site/` | Next.js 15 (App Router) + React 19 + Tailwind storefront. RO/EN via next-intl. |
| `spritz-shopify-app/` | Custom Shopify app holding the bundle tier discount Function (deploy deferred). |
| `brand/` | Design system and large source assets — see `brand/README.md`. Gitignored. |
| `video/` | Colour LUTs, generation prompts, rendered clips. |
| `_junk/` | Superseded material, kept only so nothing is lost. Safe to delete. |

## Design system

v2 "Vandal" — tokens live in `spritz-site/app/tokens/`, vendored from
`brand/vandal-ds/`. A living reference renders at `/design`. Build new surfaces
from the primitives in `spritz-site/components/ui/` rather than styling from
scratch.

## Stack

- Next.js 15 App Router, React 19, TypeScript strict
- Tailwind v3, framer-motion + Lenis (smooth scroll)
- next-intl (RO default, EN at `/en`)
- Headless Shopify Storefront API (cart + checkout)
- Claude API (Haiku) for the AI scent finder

## Features

- Editorial home with video hero and scroll-driven jumping wordmark
- Five real product pages with notes, gallery, one-time / subscription options
- Slot-style bundle builder with tiered discounts (2 → −10%, 3 → −15%, 5 → −20%)
- Persistent bundle bar across the whole shop (state shared via context)
- AI scent finder — quick picks + free text, recommends one of the five
- Cart drawer with discounts, subscription badges, hosted Shopify checkout

Everything degrades gracefully when Shopify / the Claude key are not configured.

## Getting started

```bash
cd spritz-site
npm install
cp .env.local.example .env.local   # fill in keys (see below)
npm run dev                         # http://localhost:4000
```

### Environment

`spritz-site/.env.local` (never committed):

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=
ANTHROPIC_API_KEY=
```

## Launch

Step-by-step go-live runbook: [`spritz-site/LAUNCH.md`](spritz-site/LAUNCH.md).
Shopify store + products: [`spritz-site/README-shopify.md`](spritz-site/README-shopify.md).
Bundle Function deploy: [`spritz-shopify-app/README.md`](spritz-shopify-app/README.md).
