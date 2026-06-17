# SPRITZ — Pinned Cross-Fade Hero

Editorial perfume launch site with a sticky, chapter-driven scroll experience.

## Run

```bash
cd spritz-site
npm install   # or pnpm install
npm run dev
```

Open <http://localhost:3000>.

## How the hero works

`components/HeroScroll.tsx` is the centerpiece:

- The outer `<section>` is `8 × 100vh` tall — one viewport per chapter.
- Inside, a `sticky top-0 h-screen` stage pins to the viewport while you scroll.
- A scroll listener (rAF-throttled) computes a `0 → 1` progress value based on
  how far the section has moved past the top of the viewport.
- That progress maps to a fractional frame index (`0.0 → 7.0`). Each of the
  eight bottle images is layered on top of one another and cross-fades using a
  triangular falloff around its index.
- Editorial copy (eyebrow, headline, body) cross-fades in sync with subtle
  vertical drift.
- A right-side chapter ticker visualises which chapter is active.
- Only `transform` and `opacity` are animated, so motion stays on the
  compositor.

## Replace copy

All eight chapters live in the `FRAMES` array at the top of
`components/HeroScroll.tsx`. Edit `eyebrow`, `title`, and `body` per chapter.

## Replace photos

Drop new images into `public/images/` as `bottle-01.png … bottle-08.png` (or
update the `src` paths in `FRAMES`).

## Accessibility

- Honours `prefers-reduced-motion`.
- Inactive frames are `aria-hidden` and have `pointer-events: none`.
- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`).

## Stack

- Next.js 15 (App Router)
- Tailwind CSS 3
- TypeScript
- Fonts: Cormorant Garamond (display) + Inter (UI), loaded from Google Fonts
