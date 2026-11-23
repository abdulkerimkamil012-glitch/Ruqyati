# Self-Ruqyah app — Playbook #01: Idea → MVP → Inspiration

> Working name: **Ruqyati · رقيتي** ("my ruqyah"), to be confirmed in Q10.
> Content source: `ruqyah-content.md` (10 videos + screenshot, every item labelled ✅ Sunnah / 🟡 Experience / ⚪ Support).

## 1 · Verdict + profile

- **Installable web app (PWA)**: opens from a link, adds to the home screen, works **with no internet**. No app store needed.
- **Tracker profile (local-first)**: all content is built into the app and every tick saves on the phone first. A user in a taxi with no signal can still do the full ruqyah.
- **No login in the MVP**, so there's no Supabase cost. It's like a pocket booklet: nothing to sign in to.
- **Stack: no change.** React + Vite + TypeScript, Tailwind + shadcn/ui, Motion, Dexie (on-phone storage), react-i18next (**am / ar / en**), vite-plugin-pwa, GitHub → Netlify.
- **One new rule for this app:** Quran and dua text is **imported from a verified source, never typed by AI**, and every item carries its evidence label. Any change to Arabic text is a 🔴 RED box.

## 2 · Borrow table

| App | Pattern to borrow | Type | Why it helps my users | Avoid |
|---|---|---|---|---|
| **Hisnul Muslim / Hisn** (Dua & Dhikr apps) | Each dua shows **Arabic · transliteration · meaning · hadith reference**; meaning hidden until tapped | UI · Logic | Trust: users see the source under every line | Long walls of text on one screen |
| **Dua & Azkar** (1M+ downloads) | **Tap counter** with preset counts; Arabic-only display mode; large-counter option | UI | Counting 3 / 7 without losing track | Ads; one fixed audio speed |
| **Headspace** | **Guided session: one step per screen**, calm progress bar, "Begin" button | Flow · Tone | A beginner can't get lost; feels peaceful, not scary | Long onboarding |
| **Ruqya Healing Guide** | A **plan** to follow day by day; an "emergency" quick ruqyah | Flow | Teachers say keep going for weeks; a plan keeps people consistent | **Symptom quizzes that diagnose jinn or sihr** (fear, wrong self-diagnosis) |
| **Ayat Ruqya / Ruqyah Player** | Clean verse list; works offline | UI | Fast, no internet needed | **Listen-only design**: scholars say listening isn't ruqyah, so reciting must be the default |
| **Duolingo / Apple Fitness** | **30-day ring and streak**, with a gentle "streak freeze" | Animation · Logic | Builds the daily habit all 10 teachers ask for | Loud confetti in a worship app; keep it a soft glow |

## 3 · MVP

**MVP in one sentence:** *A user taps **"Start my ruqyah"** and is guided one screen at a time through the Sunnah-only ruqyah (intention → Fatiha → Ayat al-Kursi → last 2 of Baqarah → 3 Quls ×3 → duas → blow & wipe), with Arabic text, meaning, source and a tap counter, in Amharic / Arabic / English, with no internet.*

**In the MVP**
- Home: "Start my ruqyah" · "How it works (2 min)"
- Guided session player: one step per screen, counter **1 · 3 · 7 · Free**, "hand on the pain" step
- Evidence badge and hadith reference on every step
- Library: every step and dua, readable on its own
- First-launch note: "Healing is from Allah. See a doctor too." (from video 10)
- Light / Night mode · installable · offline

**NOT in the MVP** (later milestones)
- 🟡 Extended daily list from the screenshot (Al-'Imran, Saffat, Jinn, Hashr), as **Milestone 2**, labelled "Teachers' experience"
- 30-day tracker and streak (Milestone 2)
- Ruqyah water / olive oil guide, ruqyah for a child or spouse (Milestone 3)
- Audio recitation for learning pronunciation (Milestone 3)
- Reminders, login, sync, admin panel

## 4 · Three risks

1. **If we continue** mixing proven Sunnah with teachers' "experienced" verses **→ what happens:** users believe every line is a hadith, and scholars may reject the app. **→ It's like** selling local plywood and imported MDF under one label. **→ I recommend:** a badge on every item and the Sunnah-only core as the default. (Already built into the content map.)
2. **If we continue** letting AI type the Arabic **→ what happens:** one wrong vowel in a verse is a serious error. **→ It's like** a price list with one wrong digit: every customer copies the mistake. **→ I recommend:** import the text from a verified Quran source (e.g. Tanzil / Quran.com data), add an automatic check test, and have a **local scholar review** everything before launch (one 🔴 box).
3. **If we continue** with promises like "Fatiha 200 times and the jinn left" or symptom checklists **→ what happens:** fear, people skipping doctors, and complaints. **→ It's like** a pharmacist promising a cure. **→ I recommend:** no diagnosis and no promises, plus a gentle "see a doctor too" line. Teachers' stories go only in "Learn more", clearly labelled.

## 5 · Questions (also sent in chat)
See the chat reply. Answers go into the #02 spec.
