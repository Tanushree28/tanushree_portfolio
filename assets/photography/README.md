# Photography

Drop photos straight into this folder — iPhone HEIC files are fine — then run:

```bash
./scripts/build-photography-manifest.sh
```

That does two things:

1. **Converts** each original into a web-ready JPEG in `web/` (max 1800px) plus a
   smaller thumbnail in `web/thumbs/` (max 800px). Browsers other than Safari cannot
   display HEIC at all, which is why this step exists.
2. **Rebuilds** `manifest.json`, which is what the homepage gallery reads.

Only the converted files in `web/` are committed and published; the originals stay on
your machine (they're in `.gitignore`), so the repo doesn't carry 30MB+ of camera files.
Re-running the script skips anything already converted, so it's quick.

- **Order**: newest first, by the photo's capture date. Converted files are named
  `<capture-date>-<original-name>.jpg`.
- **Captions** (optional): put one line of text in a `.txt` file with the same name as
  the original (`IMG_8593.txt` next to `IMG_8593.HEIC`). Without one, the gallery labels
  the photo with its month and year.

Preview locally with `python3 -m http.server 8000`, then open http://localhost:8000.
