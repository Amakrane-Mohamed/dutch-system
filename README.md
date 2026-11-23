# RihlaDeutch — German through Moroccan Darija

RihlaDeutch is a Moroccan Darija-first German learning product, with a public landing page, learner accounts, gated course access and a private admin review queue for manual payment verification. The lesson library keeps the original A1–B2 course and adds original Goethe A1-style reading and writing practice.

The app uses React 19, Vite 8, Tailwind v4 and Supabase Auth/Postgres. Learner progress syncs to a user-owned Supabase row; local storage keeps an account-specific cache for offline continuity.

## Supabase setup

1. Copy `.env.example` to `.env.local` and add the project's publishable (or legacy anon) key from Supabase **Project Settings → API Keys**. Never put a `service_role` or secret key in a `VITE_` variable.
2. Run the SQL files in `supabase/migrations/` in filename order in the Supabase SQL Editor.
3. Create your account through the app. In Supabase SQL Editor, grant the owner role to your account:

   ```sql
   update public.profiles set is_admin = true where email = 'you@example.com';
   ```

4. Restart Vite after editing `.env.local`. Go to `#/admin` to review pending access requests.

Users create an account, submit a payment method and transfer reference, and wait for the owner to review it. An approval grants an entitlement in the database; no payment is collected by the app. Set the real price and transfer instructions outside the app before accepting payments.

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
`python3 scripts/content/build.py` regenerates `src/content/gen/*.json` and the companion `../german-plan.md`. The new A1 practice lessons use original examples and point learners to Goethe's official material rather than reproducing its exam content.
