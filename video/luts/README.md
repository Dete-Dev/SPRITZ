# SPRITZ video LUTs

Colour grade for SPRITZ footage, matched to the v2 "Vandal" design system.

| File | Strength | Use for |
|---|---|---|
| `SPRITZ_Vandal.cube` | 100% | Hero video, ads, social. The house look. |
| `SPRITZ_Vandal_Soft.cube` | 60% | Already-warm footage, skin-heavy shots, anything the full grade pushes too far. |

Both are 33×33×33 Iridas/Adobe `.cube` files — the standard every editor reads.

## What the grade does

It is the design system applied to moving image:

- **Highlights roll to cream `#F4EDE2`, never pure white.** Same rule the site
  follows for text on ink. White walls are off-brand.
- **Shadows sink toward ink `#0A0A0A`** — but stop short of crushing. The
  product has to stay readable; that outranks the mood.
- **Midtones warm toward the perfume amber `#E5B254`** — the liquid in the
  bottle, and the warm sunlit direction the guideline asks of photography.
- **Punchy S-curve and a saturation lift**, so the label stripe colours survive
  social-media compression.

## How to load it

**Premiere Pro** — Lumetri Color → Creative → Look → Browse → pick the `.cube`.

**DaVinci Resolve** — copy the file into the LUT folder, right-click the clip →
LUT → SPRITZ. Or drop it on a node.

**Final Cut Pro** — add the Custom LUT effect to the clip → LUT: Choose → pick
the file.

**CapCut / mobile** — import under Adjust → LUT.

**OBS (live)** — Filters → Apply LUT.

**ffmpeg** (batch):

```bash
ffmpeg -i input.mp4 -vf "lut3d=SPRITZ_Vandal.cube" -c:a copy graded.mp4
```

## Notes

- Grade **before** you add grain or the vandal overlays, not after.
- The LUT expects standard Rec.709 footage. Log or raw footage needs its own
  log-to-709 conversion first, then this on top.
- If the full strength is too much on a given clip, use the Soft file rather
  than lowering opacity — the roll-off stays correct that way.

## Regenerating

Everything is computed by `generate-lut.py`; the `.cube` files are output, not
source. Change the constants at the top of `grade()` and re-run:

```bash
python3 video-luts/generate-lut.py
```

`preview/` holds a before/after still and two clips cut from the site's hero
video, regenerated whenever the grade changes.
