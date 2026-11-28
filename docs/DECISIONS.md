# DECISIONS.md

| Date | Decision | Why |
|---|---|---|
| 2026-11-23 | Quran text = KFGQPC **Hafs v18** Unicode data + matching `hafs.18` font (github.com/thetruetruth/quran-data-kfgqpc, from qurancomplex.gov.sa) | Official King Fahd Complex text; the font is built for exactly these characters |
| 2026-11-23 | Amharic meanings = **Muhammed Sadiq & Muhammed Sani Habib** (via fawazahmed0/quran-api, source tanzil.net) | Most trusted Amharic translation; reviewed by Rowwad Translation Center |
| 2026-11-23 | English meanings = **Saheeh International** (Umm Muhammad) | Widely accepted, clear |
| 2026-11-23 | Transliteration = Tanzil Latin, with "AA" shown as "ʿ" | Only verified free source; fidel version later with a scholar |
| 2026-11-23 | Audio = Mishary Alafasy, verse by verse from everyayah.com, streamed | No storage cost; clear recitation |
| 2026-11-23 | Reminders v1 = calendar file (.ics, daily repeat) | Works on every phone with no server; push later |
| 2026-11-23 | No login, Dexie on-phone storage | Free app, privacy, offline |
| 2026-11-23 | Own tiny screen router (no router package) | Few screens, fewer dependencies, fewer bugs |
| 2026-11-24 | Hosting moves to **Cloudflare Pages** (free, unlimited bandwidth, 500 builds/month); Netlify kept as backup | Netlify free credits are low and traffic costs credits |

## 2026-11-28 · Duʿāʾ pronunciation in Amharic letters
- Setting `amPron` (default on). Shown only for duʿāʾs (`src/content/duas-am.ts`), never for Quran ayahs: the Quran is read from the Arabic text.
- Letter rule: ع ዐ · ح ሐ · خ ኸ · ق ቀ · ط ጠ/ጧ · ص ሶ · ض ደ · ظ ዘ · ذ ዘ · ث ሠ · غ ገ. A hyphen marks run-on sounds (ሚነሽ-ሸይጧን); shown as a non-breaking hyphen.
- 🔴 Part of the ustaz review.
