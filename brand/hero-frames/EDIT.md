# Hero video — edit sheet

Source: `spritz-site/public/video/hero.mp4` — 15.43s, 1920×1080 (16:9).
Target: **2560×1080 (21:9)**, to match the hero frame set in `VideoHero.tsx`.

Shot boundaries below were measured from the file, not estimated.

## Keep — 10.03s

| In | Out | Length | Shot |
|---|---|---|---|
| 2.92 | 6.84 | 3.92s | Hotel door, paparazzi mob, girl gets in the limo |
| 6.84 | 7.92 | 1.08s | Hand sprays the SPRITZ tag on the wall |
| 10.40 | 12.40 | 2.00s | Man in gold chain holds *essence de safran et ambre* |
| 12.40 | 12.72 | 0.32s | Double camera-flash cut — keep, it is the transition |
| 12.72 | 15.43 | 2.71s | Bottle against night city bokeh |

## Cut — 5.40s

| In | Out | Length | Shot | Why |
|---|---|---|---|---|
| 0.00 | 2.92 | 2.92s | Couple, candlelight, *cerise et rose* bottle | owner's call |
| 7.92 | 10.40 | 2.48s | Skateboarder, daylight, MCBA Lausanne | owner's call; also the only daylight shot in a night film |

## The two holes, and the frames that close them

Regenerated footage has to join the kept footage without a visible seam. These
are the exact frames on each side of each hole, exported at both 16:9 and the
21:9 crop.

**Hole A — the new opening, 0.00–2.92 (2.92s).**
Nothing precedes it, so it is free at the start. It must END on:
`join-A-end_hotel-first-frame.jpg` — the first frame of the hotel shot.

**Hole B — between the graffiti and the gold chain, 7.92–10.40 (2.48s).**
It must START on: `join-B-start_graffiti-last-frame.jpg`
and END on:      `join-B-end_goldchain-first-frame.jpg`

## Notes for whoever generates the replacements

- Everything kept is night, warm, city. Match that. The skater was cut partly
  for being bright daylight — do not reintroduce the same clash.
- The kept shots have handheld camera movement and paparazzi flashes. Static,
  clean camera work will read as pasted in.
- Two of the three kept product shots feature *essence de safran et ambre*.
  Keep the label consistent unless there is a reason not to.
- Source frames here are 1920 wide. Generating at 2560×1080 means upscaling
  them as seeds; that is fine for a seed, but do not use these as final pixels.

## If you would rather not generate anything

Cutting both sections and closing the gaps gives a 10.03s loop with no new
footage at all. The joins would be hard cuts: limo → graffiti already works,
and graffiti → gold chain would need checking.

## Files in this folder

- `preview-cut.html` — plays the 10s cut off the real file, nothing re-encoded.
  Open it. If the video does not load from a double-click, serve the repo:
  `python3 -m http.server 8000` from the repo root, then open
  `http://localhost:8000/brand/hero-frames/preview-cut.html`
- `contact-sheet.jpg` — all 24 frames with timestamps.
- `shot*_FIRST_*.jpg` / `shot*_LAST_*.jpg` — first and last frame of every
  shot, 16:9. The `21x9/` folder holds the same set cropped to 21:9.
- `join-*.jpg` — the three frames new footage has to match. See above.
- `IDEAS.md` — product placement directions for the two holes.

There is no ffmpeg on this machine, which is why nothing here is a rendered
video. To cut a real file: `brew install ffmpeg`, then

```
ffmpeg -i hero.mp4 -vf "crop=1920:823,scale=2560:1080" -ss 2.92 -to 7.92 a.mp4
ffmpeg -i hero.mp4 -vf "crop=1920:823,scale=2560:1080" -ss 10.40 -to 15.40 b.mp4
printf "file a.mp4\nfile b.mp4\n" > list.txt && ffmpeg -f concat -i list.txt -c copy hero-cut.mp4
```

---

## Rendered

`./render.sh` builds the final files into `out/`. It uses the ffmpeg that was
already vendored at `spritz-site/node_modules/ffmpeg-static/ffmpeg` — nothing
was installed on the machine.

Sources differ (1920×1080 @30, 1920×1080 @24, 1928×1076 @24), so every segment
is centre-cropped to 21:9 and normalised to 2560×1080 @30 before concat.
Skipping that step makes the picture jump size mid-cut.

| File | Size | Notes |
|---|---|---|
| `out/hero.mp4` | 8.0 MB | H.264, 2560×1080, 15.00s |
| `out/hero.webm` | 3.8 MB | VP9, same |
| `out/hero-poster.webp` | 120 KB | frame at 0.4s |

The original `spritz-site/public/video/hero.*` is untouched.

To go live, copy the three files over the ones in `spritz-site/public/video/`.
