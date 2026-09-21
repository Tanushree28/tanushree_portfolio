#!/usr/bin/env bash
# Prepares the Photography section:
#   1. Converts any originals dropped in assets/photography/ (HEIC, JPG, PNG…)
#      into web-ready JPEGs under assets/photography/web/ plus smaller
#      thumbnails under assets/photography/web/thumbs/.
#   2. Rebuilds assets/photography/manifest.json from those web files.
#
# Usage:  ./scripts/build-photography-manifest.sh
#
# Conversion needs macOS `sips` (built in). On a machine without it — such as
# CI — step 1 is skipped and the manifest is rebuilt from whatever is already
# in web/, so the site still updates correctly.
#
# Converted files are named <capture-date>-<original-name>.jpg, and the gallery
# shows newest first. Captions are optional: put one line of text in
# <original-name>.txt next to the original.
set -euo pipefail

cd "$(dirname "$0")/.."
SRC="assets/photography"
WEB="$SRC/web"
THUMBS="$WEB/thumbs"
OUT="$SRC/manifest.json"

MAX_FULL=1800   # long edge for the lightbox image
Q_FULL=55
MAX_THUMB=800   # long edge for the grid thumbnail
Q_THUMB=58

mkdir -p "$THUMBS"

capture_date() {
  # Prefer the photo's capture date; fall back to the file's modified date.
  local f="$1" d=""
  if command -v mdls >/dev/null 2>&1; then
    d=$(mdls -raw -name kMDItemContentCreationDate "$f" 2>/dev/null | cut -c1-10)
  fi
  if [ -z "$d" ] || [ "$d" = "(null)" ]; then
    d=$(date -r "$f" +%Y-%m-%d 2>/dev/null || echo "0000-00-00")
  fi
  echo "$d"
}

if command -v sips >/dev/null 2>&1; then
  converted=0
  while IFS= read -r src; do
    base="$(basename "$src")"
    stem="${base%.*}"
    name="$(capture_date "$src")-$stem.jpg"

    if [ ! -f "$WEB/$name" ] || [ "$src" -nt "$WEB/$name" ]; then
      sips -s format jpeg -s formatOptions "$Q_FULL" \
           --resampleHeightWidthMax "$MAX_FULL" "$src" --out "$WEB/$name" >/dev/null 2>&1
      sips -s format jpeg -s formatOptions "$Q_THUMB" \
           --resampleHeightWidthMax "$MAX_THUMB" "$src" --out "$THUMBS/$name" >/dev/null 2>&1
      echo "converted  $base  ->  web/$name"
      converted=$((converted + 1))
    fi

    # Carry a caption sidecar over to the converted name.
    if [ -f "$SRC/$stem.txt" ] && [ ! -f "$WEB/${name%.jpg}.txt" ]; then
      cp "$SRC/$stem.txt" "$WEB/${name%.jpg}.txt"
    fi
  done < <(find "$SRC" -maxdepth 1 -type f \( \
      -iname '*.heic' -o -iname '*.heif' -o -iname '*.jpg' -o \
      -iname '*.jpeg' -o -iname '*.png' -o -iname '*.tif' -o -iname '*.tiff' \) | LC_ALL=C sort)
  [ "$converted" -eq 0 ] && echo "No new originals to convert."
else
  echo "sips not available — skipping conversion, rebuilding manifest only."
fi

{
  echo "["
  first=1
  while IFS= read -r path; do
    file="$(basename "$path")"
    caption=""
    sidecar="$WEB/${file%.jpg}.txt"
    [ -f "$sidecar" ] && caption="$(head -n 1 "$sidecar" | tr -d '\r' | sed 's/"/\\"/g')"
    [ $first -eq 1 ] || echo ","
    first=0
    printf '  { "file": "web/%s", "thumb": "web/thumbs/%s", "caption": "%s" }' "$file" "$file" "$caption"
  done < <(find "$WEB" -maxdepth 1 -type f -iname '*.jpg' | LC_ALL=C sort -r)
  echo ""
  echo "]"
} > "$OUT.tmp"

mv "$OUT.tmp" "$OUT"
echo "Wrote $OUT ($(grep -c '"file"' "$OUT" || true) photo(s), newest first)"
