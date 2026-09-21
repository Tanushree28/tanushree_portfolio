#!/usr/bin/env bash
# Builds web-sized copies of the hero slideshow photos into assets/images/web/.
# The originals in assets/images/ are left untouched — they're the masters.
#
# Usage:  ./scripts/optimize-headshots.sh
set -euo pipefail

cd "$(dirname "$0")/.."
SRC="assets/images"
WEB="$SRC/web"
MAX=1200   # the hero card is ~450px wide, so 1200 covers retina
Q=62

command -v sips >/dev/null 2>&1 || { echo "sips not available (macOS only)"; exit 1; }
mkdir -p "$WEB"

for src in "$SRC"/*.jpeg "$SRC"/*.jpg; do
  [ -f "$src" ] || continue
  name="$(basename "${src%.*}").jpg"
  if [ ! -f "$WEB/$name" ] || [ "$src" -nt "$WEB/$name" ]; then
    sips -s format jpeg -s formatOptions "$Q" --resampleHeightWidthMax "$MAX" \
         "$src" --out "$WEB/$name" >/dev/null 2>&1
    echo "optimized  $(basename "$src")  ->  web/$name"
  fi
done

before=$(du -sk "$SRC" --exclude web 2>/dev/null | cut -f1 || find "$SRC" -maxdepth 1 -type f -print0 | xargs -0 stat -f %z | awk '{s+=$1} END {print int(s/1024)}')
after=$(find "$WEB" -type f -print0 | xargs -0 stat -f %z | awk '{s+=$1} END {print int(s/1024)}')
echo "originals: ${before}KB   web copies: ${after}KB"
