#!/usr/bin/env bash
# Renders the SPRITZ hero from the edit sheet in EDIT.md.
#
# Four segments: two generated, two lifted from the original file. Sources
# differ in size (1920x1080, 1928x1076) and frame rate (24 and 30), so every
# segment is normalised to the same 2560x1080 / 30fps before concat —
# otherwise the joins stutter or the picture jumps size mid-cut.
#
# Nothing here overwrites the original hero.mp4. Output lands in ./out.
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
FF="$DIR/../../spritz-site/node_modules/ffmpeg-static/ffmpeg"
SRC="$DIR/../../spritz-site/public/video/hero.mp4"
OUT="$DIR/out"
TMP="$DIR/out/seg"
mkdir -p "$TMP"

# Centre-crop whatever comes in to 21:9, then scale to the target.
# min() picks the constraining axis, so a 1928x1076 clip crops by width
# and a 1920x1080 one crops by height, without either being stretched.
VF="crop='min(iw,ih*21/9)':'min(ih,iw*9/21)',scale=2560:1080:flags=lanczos,setsar=1,fps=30"

cut () { # cut <in> <start> <duration> <index>
  "$FF" -y -loglevel error -ss "$2" -t "$3" -i "$1" \
    -vf "$VF" -an \
    -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p \
    -g 60 -keyint_min 60 -sc_threshold 0 \
    "$TMP/$4.mp4"
}

echo "1/4 generated opening"
cut "$DIR/generated/FINAL-holeA-skater-bottle.mp4" 0.10 2.92 01
echo "2/4 hotel, mob, limo, tag"
cut "$SRC" 2.92 4.56 02
echo "3/4 generated bottle at wall"
cut "$DIR/generated/FINAL-holeB-bottle-at-wall.mp4" 0.10 2.48 03
echo "4/4 gold chain, flash, night street"
cut "$SRC" 10.40 5.00 04

printf "file '%s'\n" "$TMP"/0{1,2,3,4}.mp4 > "$TMP/list.txt"

echo "concat -> mp4"
"$FF" -y -loglevel error -f concat -safe 0 -i "$TMP/list.txt" -c copy "$OUT/hero.mp4"

echo "encode -> webm"
"$FF" -y -loglevel error -i "$OUT/hero.mp4" \
  -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 -threads 8 \
  -pix_fmt yuv420p -an "$OUT/hero.webm"

echo "poster"
"$FF" -y -loglevel error -ss 0.4 -i "$OUT/hero.mp4" -frames:v 1 \
  -c:v libwebp -quality 82 "$OUT/hero-poster.webp"

rm -rf "$TMP"
ls -lh "$OUT"
