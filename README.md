# Rihla · رحلة — German A1 → B2 through Arabic

Mohamed's personal system for German (Ausbildung Fachinformatiker für Anwendungsentwicklung, start 1 Sep 2027).
One React 19 + Vite 8 + Tailwind v4 code base, used as a **web/PWA** and as a **macOS desktop app** (Electron).

## Web
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/ (PWA, offline service worker)
npm run lint && npm test
```

## macOS desktop app (Apple Silicon)
```bash
npm run app          # build, then open the Electron window
npm run app:dev      # Vite dev server with hot reload inside the Electron window
npm run package:mac  # release/Rihla-darwin-arm64/Rihla.app + release/Rihla-mac-arm64.zip
npm run icons        # regenerate build/icon.icns from build/icon.svg
npm run smoke:app    # (Linux/macOS) checks persistence, YouTube embed and link handling
```
- `electron/main.cjs` serves `dist/` from the privileged scheme `app://rihla/`, so the origin is stable and
  `localStorage` (all progress) persists in `~/Library/Application Support/Rihla/`.
- External links open in the default browser; YouTube embeds play in the window.
- The service worker is skipped in the app; Web Speech **recognition** is replaced by a record-and-listen-back
  recorder (Electron has no Google speech service). Text-to-speech uses the macOS German voices.
- Packaging on macOS uses `codesign --sign -` and `ditto`; on Linux it uses `rcodesign` (ad-hoc) and a
  symlink-preserving zip (`scripts/zip-keep-symlinks.py`).

## Content
`python3 scripts/content/build.py` regenerates `src/content/gen/*.json` and `../german-plan.md`.
