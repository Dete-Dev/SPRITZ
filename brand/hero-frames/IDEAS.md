# Filling the two holes — product placement, vandal / skate / Y2K

The point is the clash. The kept footage is expensive-looking: a celebrity, a
mob of paparazzi, a limo, a bottle glowing in bokeh. That is every perfume ad
ever made. The new footage should look like it was shot by someone who was not
invited. Put the two next to each other and the brand argument makes itself —
**the same bottle, on the wrong side of the door, for a hundred euro.**

So do not try to blend the new footage in. Make it visibly cheaper, rougher and
closer to the ground. The seam is the idea.

## The one rule

Two cameras, on purpose.

| | Kept footage | New footage |
|---|---|---|
| Camera | cinema, clean, shallow | camcorder / digicam, fisheye |
| Light | warm, controlled, night | hard on-camera flash, daylight, sodium street light |
| Motion | smooth, floaty | handheld, whip pans, dropped frames |
| Framing | flattering, eye level | ground level, too close, half out of frame |
| Grade | rich, filmic | slightly green, crushed blacks, blown highlights |

If a viewer cannot tell which shot came from which world, it has failed.

---

## Hole A — the opening. 2.92s. Must END on the hotel door.

This is the strongest slot in the film, because whatever it is cuts straight
into a celebrity walking out of a luxury hotel.

### A1 — Outside looking in *(my pick)*

Skaters on the kerb across the road from the hotel. One of them holds the
bottle up so it lines up with the lit hotel entrance behind it — the bottle
literally standing in front of the place he cannot go in. Shot on a fisheye
from a crouch. Then cut: the doors turn and she walks out.

Why it works: the cut becomes a sentence. Outside → inside. Same bottle.

### A2 — The hand-off

Tight on two hands. A bottle passed between them fast and low, the way
something gets passed when you do not want it seen. Rings, chipped nails, a
grip-taped board under one arm. Camcorder, on-camera flash, one hard shadow.
Cut on the movement of the hand into the movement of the revolving door.

### A3 — Grip tape and glass

Extreme close-up: the bottle sat on a skateboard deck, sticker-bombed, being
carried. The deck tilts, the bottle slides, a hand catches it. Y2K digicam,
timestamp burned into the corner, slight motion blur.

### A4 — The mirror

A Y2K bathroom-mirror moment: flip phone or early digicam, flash blowing out
the frame, someone spraying the bottle at their neck in a grotty club toilet
with the tag scrawled on the tiles. Cut from that flash into the paparazzi
flashes at the door — the flash is the edit.

Why it works: it steals the transition device the film already uses at 12.40.

---

## Hole B — where the skater was. 2.48s.
**Must START on the graffiti wall. Must END on the man in the gold chain.**

Both ends are already street. So this one does not need to introduce the
clash — it needs to carry the product across it, in the dark.

### B1 — The can becomes the bottle *(my pick)*

Continue the spray from the shot before. The hand finishes the tag, drops the
can, and the same hand comes up with the bottle and sprays that instead — same
gesture, same wrist, same hiss. Match the two sprays frame for frame.

Why it works: your logo is a spray tag and your product is a spray. Nobody has
to explain the joke. It also solves the join at both ends — starts on the wall,
ends on a hand holding a bottle, which is exactly what the gold-chain shot is.

### B2 — Cans on the ledge

A row of spray cans lined up on a waxed ledge at night. One of them is not a
spray can, it is the bottle. Camera dollies past. A board grinds through frame
and knocks it over. Cut before it lands.

### B3 — Trolley run

Handheld chase down a car park ramp, someone filming a friend running, sodium
lights strobing. The bottle is in his hand the whole time, held like he took
it. Ends on him stopping dead, breathing, holding it up to camera — which is
the pose the gold-chain shot opens on.

---

## Product placement rules, whichever you pick

1. **The label must be readable for at least 12 frames.** Nice footage where
   nobody can read the bottle is not an ad.
2. **Two of the kept shots are *essence de safran et ambre*.** Use that same
   one, or you are advertising three products in ten seconds.
3. **Never set the bottle down carefully.** It gets carried, passed, dropped,
   pocketed, knocked. Care is what the luxury half is for.
4. **Hands do the acting.** No faces needed. Cheaper to generate, and it keeps
   the celebrity as the only real face in the film.
5. **Keep the palette.** Your accents are red, yellow, blue on ink and cream.
   Sodium orange and green camcorder cast fit that. Teal-and-orange blockbuster
   grading does not.

## Generation notes

- Generate at **2560×1080**. Seeds are 1920 wide, so they upscale — fine as a
  seed, not as final pixels.
- Feed `join-A-end_hotel-first-frame-21x9.jpg` as the **end** frame for hole A.
- Feed `join-B-start_graffiti-last-frame-21x9.jpg` as the **start** frame and
  `join-B-end_goldchain-first-frame-21x9.jpg` as the **end** frame for hole B.
- Ask for handheld camera movement explicitly. Generated video defaults to
  smooth and floaty, which is the exact wrong texture here.
