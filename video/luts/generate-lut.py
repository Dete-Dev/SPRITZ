#!/usr/bin/env python3
"""
Build the SPRITZ video LUTs.

The grade is the design system applied to moving image:

  - Highlights roll off to CREAM (#F4EDE2), never to pure white. This is the
    same rule the site follows for text on ink — white walls are off-brand.
  - Shadows sink toward INK (#0A0A0A), neutral, with only a trace of warmth
    so they read as printed black rather than digital black.
  - Midtones push toward the perfume AMBER (#E5B254) — the liquid in the
    bottle, and the warm sunlit direction the guideline asks of photography.
  - A punchy S-curve — but the shadows stop short of crushing. Product has to
    stay readable in frame; that outranks the mood.
  - Saturation lifted so the label stripe colours survive compression.

Writes a standard Iridas/Adobe .cube 3D LUT, which Premiere, Resolve, Final
Cut, DaVinci, OBS, CapCut and ffmpeg all read.

    python3 video-luts/generate-lut.py
"""

SIZE = 33  # 33^3 = 35937 entries — the industry-standard grid


def hex_rgb(h: str) -> tuple[float, float, float]:
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) / 255 for i in (0, 2, 4))


INK = hex_rgb("#0A0A0A")
CREAM = hex_rgb("#F4EDE2")
AMBER = hex_rgb("#E5B254")

# Rec.709 luma weights.
LUMA = (0.2126, 0.7152, 0.0722)


def s_curve(x: float, amount: float) -> float:
    """Smooth contrast around 0.5. amount 0 = identity."""
    if amount <= 0:
        return x
    curved = x * x * (3 - 2 * x)  # smoothstep
    return x + (curved - x) * amount


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def grade(r: float, g: float, b: float, strength: float) -> tuple[float, ...]:
    # --- 1. Contrast -------------------------------------------------------
    r, g, b = (s_curve(c, 0.40) for c in (r, g, b))

    lum = r * LUMA[0] + g * LUMA[1] + b * LUMA[2]

    # --- 2. Split tone -----------------------------------------------------
    # Shadows toward ink, highlights toward cream. Weighted so the effect
    # concentrates at the two ends and leaves the mids alone.
    shadow_w = (1 - lum) ** 2.2
    highlight_w = lum**2.4

    out = []
    for c, ink_c, cream_c in zip((r, g, b), INK, CREAM):
        c = lerp(c, c * 0.88 + ink_c * 0.12, shadow_w * 0.38)
        c = lerp(c, c * 0.55 + cream_c * 0.45, highlight_w * 0.60)
        out.append(c)
    r, g, b = out

    # --- 3. Warm the midtones toward the perfume amber ---------------------
    mid_w = 1 - abs(lum - 0.45) * 2
    mid_w = max(0.0, mid_w) ** 1.5
    r, g, b = (
        lerp(c, c * 0.88 + amber_c * 0.12, mid_w * 0.42)
        for c, amber_c in zip((r, g, b), AMBER)
    )

    # --- 4. Saturation -----------------------------------------------------
    lum2 = r * LUMA[0] + g * LUMA[1] + b * LUMA[2]
    sat = 1.18
    r, g, b = (lum2 + (c - lum2) * sat for c in (r, g, b))

    # --- 5. Dial the whole grade back by `strength` -------------------------
    return tuple(
        min(1.0, max(0.0, lerp(src, dst, strength)))
        for src, dst in zip(grade.source, (r, g, b))
    )


def write_cube(path: str, title: str, strength: float) -> None:
    lines = [
        f'TITLE "{title}"',
        f"LUT_3D_SIZE {SIZE}",
        "DOMAIN_MIN 0.0 0.0 0.0",
        "DOMAIN_MAX 1.0 1.0 1.0",
        "",
    ]
    # .cube iterates red fastest, then green, then blue.
    for bi in range(SIZE):
        for gi in range(SIZE):
            for ri in range(SIZE):
                src = (ri / (SIZE - 1), gi / (SIZE - 1), bi / (SIZE - 1))
                grade.source = src
                r, g, b = grade(*src, strength)
                lines.append(f"{r:.6f} {g:.6f} {b:.6f}")

    with open(path, "w") as fh:
        fh.write("\n".join(lines) + "\n")
    print(f"wrote {path}  ({SIZE}^3 = {SIZE**3} entries, strength {strength:.0%})")


if __name__ == "__main__":
    write_cube("video-luts/SPRITZ_Vandal.cube", "SPRITZ Vandal", 1.0)
    write_cube("video-luts/SPRITZ_Vandal_Soft.cube", "SPRITZ Vandal Soft", 0.60)
