# Generation prompts — the two holes

Written in the same register as `brand/editorial/template-*.txt`: the label is
locked first, then the scene, then the camera, because the label is the thing
these models destroy.

## Before you run anything

**Aspect ratio.** Most video models output 16:9, not 21:9. Generate **16:9 at
the highest resolution offered**, keep all the action inside the centre band,
then crop to 2560×1080 afterwards. That is why each prompt says "compose for a
centre crop". Feed the **16:9** seed frames (`join-*.jpg`, not the `-21x9`
ones) — the 21:9 versions are for checking framing only.

**Length.** Models generate 5s or 10s. Hole A needs 2.92s and hole B needs
2.48s. Generate 5s and trim to the join. Do not try to hit the exact duration.

**The bottle.** Use *essence de safran et ambre* — the amber/yellow-striped
label — because that is the bottle in the two kept shots either side. Pass a
product photo from `spritz-site/public/images/scents/safran-ambre/` as a
reference image alongside the seed frame if the model accepts more than one.

---

## HOLE A — the opening
**2.92s · END frame: `join-A-end_hotel-first-frame.jpg` · no start frame**

> **Live-action photography. Real camera, real people, real objects.**
> Not CGI, not a 3D render, not a game engine, not illustration, not
> animation, not stylised. Every degradation below is a real optical or
> tape artefact from the camera itself, never a post-production filter or
> overlay. Real skin with pores and stubble, real dust and grit, real
> scratches and fingerprints on the glass, real reflections that obey the
> lights actually in the scene.
>
> Photorealistic handheld camcorder footage, night, city street. A SPRITZ
> perfume bottle from the reference image, unchanged: clear rectangular glass,
> chrome cap, pale champagne-gold liquid, and the printed label kept exactly as
> photographed — a rough hand-drawn black graffiti SPRITZ scrawl with a long
> horizontal stroke through it, above a band of diagonal amber candy stripes
> carrying the French scent name. Do not redraw, restyle or re-letter the
> label.
>
> Two young skateboarders sit on a kerb across a wet road from the lit entrance
> of a grand hotel. One of them holds the bottle up at arm's length so it lines
> up dead centre in front of the hotel's glowing revolving door in the
> background. Boards under their feet, sticker-bombed decks, baggy jeans,
> hoods up. The camera is low, almost on the tarmac, tilted up past the bottle
> toward the hotel. It drifts and re-frames like someone filming their mate,
> never smooth, never on a gimbal.
>
> Shot on a late-1990s MiniDV camcorder with a fisheye adapter: heavy barrel
> distortion, interlaced softness, crushed blacks, blown-out street lamps,
> a faint green cast, visible video noise, small timecode burn in the corner.
> Sodium-orange street light, wet asphalt reflections, cold blue from the hotel
> windows. Handheld, real, unpolished.
>
> The shot ends by pushing in past the bottle toward the hotel entrance until
> the revolving door fills the frame.
>
> Compose for a centre 21:9 crop — keep the bottle and the hotel door inside
> the middle band, nothing important near the top or bottom edge.
>
> No CGI, no 3D render, no game-engine look, no illustration, no anime, no
> painterly or airbrushed texture, no plastic or waxy skin, no doll faces, no
> perfect symmetry. No captions, no titles, no logos other than the bottle
> label, no lens flares, no slow-motion, no cinematic colour grading, no
> smooth camera moves.

**Why it ends this way:** the last frame has to become the hotel door, so the
push-in hands over cleanly to the kept footage.

---

## HOLE B — where the skater was
**2.48s · START frame: `join-B-start_graffiti-last-frame.jpg`
· END frame: `join-B-end_goldchain-first-frame.jpg`**

> **Live-action photography. Real camera, real people, real objects.**
> Not CGI, not a 3D render, not a game engine, not illustration, not
> animation, not stylised. Every degradation below is a real optical or
> tape artefact from the camera itself, never a post-production filter or
> overlay. Real skin with pores and stubble, real dust and grit, real
> scratches and fingerprints on the glass, real reflections that obey the
> lights actually in the scene.
>
> Photorealistic handheld footage, night, tight on a pair of hands against a
> dark brick wall carrying a freshly sprayed black graffiti tag.
>
> A tattooed forearm finishes the last stroke of the tag with an aerosol can,
> then drops the can out of frame. The same hand comes straight back up
> holding a SPRITZ perfume bottle and sprays that instead — identical wrist
> action, identical angle, a fine atomised mist catching the light exactly
> where the spray paint did. The gesture must rhyme: can out, bottle in, same
> movement.
>
> The bottle is from the reference image, unchanged: clear rectangular glass,
> chrome cap, pale champagne-gold liquid, and the printed label exactly as
> photographed — a rough hand-drawn black graffiti SPRITZ scrawl with a long
> horizontal stroke through it, above a band of diagonal amber candy stripes
> carrying the French scent name. Do not redraw, restyle or re-letter the
> label. The label must be readable and in focus for the second half of the
> shot.
>
> Handheld, close, slightly too close. Shallow depth of field, the wall falling
> off into darkness behind. Hard directional light from one side like a phone
> torch or a car headlight, deep black shadows, warm rim on the glass and the
> chrome cap. Fine video grain, slightly crushed blacks.
>
> The shot ends with the hand holding the bottle up toward the camera in the
> dark, wrist high, background almost black.
>
> Compose for a centre 21:9 crop — keep the hands, the can and the bottle
> inside the middle band.
>
> No CGI, no 3D render, no game-engine look, no illustration, no painterly or
> airbrushed texture, no plastic or rubbery hands, no extra fingers, no
> impossible reflections. No captions, no titles, no faces, no other logos, no
> slow-motion, no smooth gimbal movement, no colour grading toward teal and
> orange.

**Why it ends this way:** the gold-chain shot opens on a hand holding the
bottle up in near-darkness. Ending on the same pose makes the cut invisible.

---

## If a generation comes back wrong

| Symptom | Fix in the prompt |
|---|---|
| Label is garbled or re-lettered | Repeat the "do not redraw" clause at the very end too; pass a second reference photo of the bottle. |
| Camera glides smoothly | Add "shaky, amateur, operator is walking" and "no tripod, no gimbal, no stabilisation". |
| Looks like a car advert | Add "shot on consumer camcorder, low dynamic range, blown highlights". |
| Too bright / daylight | Add "night only, no daylight, no blue sky". The skater shot was cut for exactly this. |
| Bottle drifts off centre | Add "bottle stays centred in frame throughout". |
| Looks rendered / CGI / plastic | Move the live-action lock to the very end as well. Add "documentary footage, shot on location" and "visible skin texture, visible dust". |
| Hands are mangled | Hands are the hardest thing these models do. Add "anatomically correct hands, five fingers" and generate more takes — this one is usually fixed by rerolling, not rewording. |
