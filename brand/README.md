# Brand sources

Large originals. Everything the site actually serves is a processed copy under
`spritz-site/public/` — these are the masters you regenerate from.

| Path | What it is |
|---|---|
| `vandal-ds/` | **The design system, v2 "Vandal".** Source of truth. Its `tokens/*.css` are vendored verbatim into `spritz-site/app/tokens/` — edit them there and re-copy, never edit the vendored copy alone. Also ships a full interactive shop UI kit at `ui_kits/shop/index.html` worth reading before designing a new surface. |
| `labels/` | The 22 transparent label artworks. Each scent's stripe colour in `lib/scents.ts` is sampled from these, so a product card can never drift from its bottle. |
| `bottle-photos.zip` | The shoot the 22 product photos are cropped from. |
| `guideline.pdf` | The printed June 2026 brand guideline. Predates the Vandal system but is what it was built on — palette, wordmark rules, the label stripe system. |
| `logo.png` | The graffiti wordmark master. |

All of this is gitignored: too large for the repo, and none of it is needed to
build or deploy.

## Regenerating the product photos

The crop is computed, not eyeballed — sample the corner colour, find the
bounding box of everything that differs from it, crop to that plus an even
margin. That is what keeps every bottle the same size in its card. If you
reshoot, re-run that step rather than cropping by hand.
