# plan.md · Ruqyati (Playbook #03)

**Goal:** deliver the **whole app once**, finished and checked. Built box by box on branch `build`, merged to `main` and deployed **one time**.

## Decisions on the open questions (owner said "keep building"; defaults applied)

| # | Question | Decision now | Can change later |
|---|---|---|---|
| 1 | Scholar reviewer | **Launch gate:** the app shows "Review pending" in About until a named scholar signs off | Owner gives a name |
| 2 | Reminders | **Calendar reminder (.ics)**: works on every phone, offline, no server. In-app daily nudge on open. | Real push notifications = Milestone 4 (needs a small free Supabase server) |
| 3 | Dua audio | Duas show text only; Quran audio is live | A local imam records ~10 duas |
| 4 | Amharic-letter transliteration | Latin transliteration (Tanzil) now | Fidel version drafted + scholar-checked = Milestone 4 |
| 5 | Reciter | **Mishary Alafasy** (verse by verse, everyayah.com) | — |
| 6 | Extended routine | Hidden behind its own tile with an amber label | — |

## Milestones (all built before the single deploy)

| M | Name | Contains |
|---|---|---|
| F1 | Foundation | Vite + React + TS strict, Tailwind, i18n am/ar/en, Dexie, PWA, theme, fonts, errors |
| M1 | Content | Verified Quran passages (KFGQPC Hafs v18), Amharic (Sadiq & Sani), English (Saheeh Intl), transliteration, duas, routines; integrity tests |
| M2 | Ruqyah | Home, choose routine, session player (counter 1·3·7·Free, audio, resume), blow & wipe, complete |
| M3 | Library & care | Library, guidance articles, ruqyah for child/spouse, water & oil, learn more |
| M4 | Habit | 30-day tracker (Ethiopian + Gregorian), streak with weekly rest day, calendar reminder |
| M5 | Polish & ship | Welcome, settings, about, offline, 360px checks in am/ar/en, light/night, deploy once |
| Later | — | Push notifications, fidel transliteration, dua audio, scholar sign-off |
