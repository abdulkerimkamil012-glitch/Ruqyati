# Ruqyati: rules for every change

- Read `docs/spec.md`, `docs/ruqyah-content.md`, `docs/todo.md`, `docs/DECISIONS.md` first.
- **Quran Arabic text is never typed by hand or AI.** It comes only from `scripts/build-quran.mjs` (KFGQPC Hafs v18 data). `src/content/quran.json` is generated; never edit it.
- Dua Arabic text lives in `src/content/duas.ts`. Every change there is 🔴 RED and needs scholar review.
- Every step shows its label: ✅ sunnah · 🟡 experience · ⚪ support. The default routine contains ✅ only.
- No diagnosis, no promises of cure, no symptom quizzes.
- TypeScript strict, files under 250 lines, every UI word in `src/i18n/{en,am,ar}.ts` (am/ar typed against en), Western digits.
- Dates: local day key `YYYY-MM-DD`; Ethiopian calendar via `Intl` (`ethiopic`).
- Errors through `src/lib/errors.ts` (friendly codes). Never hard-delete user data.
- Tests first for logic (`npm test`). `npm run build` must pass before any push.
- Docs-only commits end with `[skip netlify]`. App code goes to branch `build`; `main` = production.
