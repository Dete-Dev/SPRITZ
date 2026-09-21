# SPRITZ — rapper flex, 4 seconds

Fisheye, paparazzi flash. Night, hard, loud.

Reference image (frame 1, image-to-video):
`spritz_labels_transparent/bottle_mockups/12_MFK_Baccarat_Rouge_540_essence_de_SAFRAN_et_AMBRE.png`

Swap the reference to re-shoot the same clip per scent.

---

## Prompt

Fisheye lens, very close. A young rapper shoves the perfume bottle from the
reference image into the lens, arm out, leaning back. Gold chain, dark jacket.
Harsh direct paparazzi flash pops twice — bottle blown bright, background
falling to black. Night street behind, warped by the fisheye. Slow push in.
Flat look down the lens. One take.

## Negative

warped label, distorted text, extra fingers, changing bottle shape, cutting
away, fast cuts, smiling, dancing, daylight, soft light, teal-and-orange,
watermark, logo overlays

---

## Settings

- **4s** · **9:16** social, **16:9** site hero
- **Motion** low. One move. The spray is its own clip.
- **Lens** fisheye 8–15mm, heavy barrel distortion, bottle nearest the glass
- **Light** on-camera flash only, no fill, hard falloff
- **Model** Seedance 2.0 for motion; Nano Banana 2 to hold the bottle exact

## After

```bash
ffmpeg -i clip.mp4 -vf "lut3d=video-luts/SPRITZ_Vandal.cube" -c:a copy clip-graded.mp4
```

The LUT rolls the blown flash highlights to cream instead of clipping white.
That is the on-brand part. Grade first, grain and overlays after.
