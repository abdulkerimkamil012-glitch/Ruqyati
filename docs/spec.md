# spec.md: Ruqyati · رقيتي · ሩቅያቲ

> Playbook #02 · v1 · 22 Nov 2026 · Owner: Abdulkerim
> Content brain: `ruqyah-content.md` · Idea: `idea.md`
> Items marked **[OPEN]** wait for the owner's answer (section 10).

---

## 1. Overview

- **What:** a free self-ruqyah app (**ṣadaqah jāriyah**) that guides a person, step by step, to do ruqyah on **themselves, their child or spouse**, using **only the Quran and authentic Sunnah**. Sources are shown on every step.
- **Who:** any Muslim, especially in Ethiopia. Many users have weak internet, and many can't read Arabic well.
- **Promise:** *"Open, tap Start, follow the screen. Five minutes. No internet needed."*
- **Shape:** installable web app (PWA), **Tracker profile**: everything saves on the phone, with **no login**.
- **Languages:** **Amharic (default) · Arabic · English.** The Quran is **always in Arabic**, in the official **Madinah Mushaf font**.
- **Delivery:** the whole app is built and tested box by box on a branch, then **one production deploy** when everything is finished and checked.

> 🪵 **Memory hook:** we build the whole kitchen in the workshop, test every drawer, then deliver it **once**, complete.

---

## 2. Roles & permissions

| Role | Who | Can do |
|---|---|---|
| **User** | Anyone who opens the link | Everything in the app. No account. Data stays on their phone. |
| **Owner** (you) | Abdulkerim | Change content only through GitHub (reviewed boxes). A hidden **About → Health** card shows version, content version and last scholar review date. |
| **Scholar reviewer** | **[OPEN]** | Signs off all Arabic text, translations and sources before launch. Their name is shown in **About**, if they agree. |

---

## 3. Screens

| # | Screen | One main action | Shows first | Borrowed from |
|---|---|---|---|---|
| S1 | **Welcome** (3 calm screens, first launch only) | Continue | ① Choose language ② "How it works" in 3 lines ③ *"Healing is from Allah alone. Ruqyah and medicine go together."* | Headspace |
| S2 | **Home** | **Start my ruqyah** (big button) | Today's ring (done / not yet), 30-day progress, quick tiles | Apple Fitness |
| S3 | **Choose ruqyah** (sheet) | Pick one | ✅ **Sunnah ruqyah** (~5 min, default) · 🟡 **Extended daily ruqyah** (~20 min) · **For my child / spouse** · **Pain right now** (one step) | — |
| S4 | **Session player** | Tap the **counter** | One step per screen: Arabic (Mushaf font) → transliteration → meaning → badge + source → **counter** → ▶ audio | Hisn + Dua & Azkar + Headspace |
| S5 | **Blow & wipe** step | Done | Simple illustration: blow lightly into palms, wipe face then body | Sunnah (Bukhari 5017) |
| S6 | **Session complete** | Back home | Soft glow (no confetti), today's ring closes, *"May Allah grant you shifāʾ"* | Apple Fitness (softened) |
| S7 | **Library** | Open a topic | Sunnah core · Duas · Extended list (🟡) · Evil-eye protection · Ruqyah for others · Water & olive oil · Scholars' guidance · Learn more | Hisnul Muslim |
| S8 | **Tracker** | View a day | 30-day ring and calendar (Ethiopian + Gregorian), streak, gentle "rest day" | Duolingo (softened) |
| S9 | **Reminders** | Set a time | Morning / evening switches, time pickers | Dua & Azkar |
| S10 | **Settings** | — | Language · meaning language · transliteration (Amharic letters / Latin / off) · Quran font size · reciter · Light / Night · About & sources | — |

**Every screen has 4 states:** skeleton while loading · empty (teaches the next step) · friendly error with **Try again** · success.

---

## 4. Content model (built into the app as data files)

| Entity | Fields | Rule |
|---|---|---|
| **Passage** (Quran) | `id`, `surah`, `ayahFrom`, `ayahTo`, `arabic` (QPC Hafs text), `meaningAm`, `meaningEn`, `translitFidel`, `translitLatin`, `audioKey` | Arabic **imported** from the verified file, never typed. A test compares it with a checksum. |
| **Dua** | `id`, `arabic`, `translitFidel`, `translitLatin`, `meaningAm`, `meaningEn`, `ar`, `source` (book + number), `grade` (ṣaḥīḥ / ḥasan), `label` (✅/🟡/⚪), `audioKey?` | Only ṣaḥīḥ or ḥasan narrations. |
| **Step** | `id`, `kind` (intention · refuge · passage · dua · handOnPain · blowWipe · note), `refId`, `defaultCount` (1/3/7/free), `label`, `noteKey` | — |
| **Routine** | `id` (`sunnah`, `extended`, `child`, `spouse`, `pain`), `steps[]`, `minutes` | `sunnah` is the default and contains ✅ items only. |
| **Guide article** | `id`, `titleKey`, `bodyKey`, `sources[]` | Scholars' guidance, water & oil, mahram rules, the 3 conditions of ruqyah. |

### On-phone data (Dexie)

| Table | Fields |
|---|---|
| `settings` | language, meaningLang, translit, fontScale, reciter, theme, onboarded |
| `sessions` | `id` (uuid), `routineId`, `dayKey` (local date `YYYY-MM-DD`), `startedAt` / `completedAt` (UTC), `stepsDone` |
| `reminders` | `id`, `slot` (morning/evening), `time` (HH:mm local), `enabled`, `pushEndpoint?` |

### Server (only if push reminders are chosen, **[OPEN] Q2**)

| Table | Fields | RLS |
|---|---|---|
| `push_subscriptions` | `id`, `endpoint` (unique), `keys`, `remind_at_local`, `tz`, `lang`, `created_at`, `archived_at` | No direct client access; only through an Edge Function. Nothing personal is stored. |

---

## 5. Business rules (with examples)

1. **A day counts as done** when the user finishes **every step** of any routine.
   - *Example:* Fatiha and Ayat al-Kursi done, then the app is closed → **not done**. Next time the session **resumes at step 3**.
2. **Day boundary = the user's local midnight.** Stored in UTC, shown in local time.
   - *Example:* finished 23:50 Addis time = today.
3. **Counter:** target **1 · 3 · 7 · Free**.
   - At the target: gentle vibration + check mark, then **auto-advance after 0.8 s** (can be turned off).
   - **Free** mode: the user taps **Next** whenever they wish.
   - Taps closer than 150 ms apart count once (no double counts).
4. **Default counts come from the evidence:** Fatiha 1/3/7 (user picks), the 3 Quls ×3, *aʿūdhu billāhi wa qudratihi* ×7, *asʾalu-llāha-l-ʿaẓīm* ×7, Bismillah ×3.
5. **Labels are always visible:** ✅ Sunnah · 🟡 Teachers' experience · ⚪ Helpful habit. The 🟡 extended routine shows a one-line note before it starts.
6. **Streak:** consecutive days done. **One rest day per 7 days** keeps the streak (Duolingo-style freeze).
   - Goal shown: **30 days**, because teachers advise at least a month of consistency.
   - *Example:* days 1–6 done, day 7 missed, day 8 done → streak 8, freeze used.
7. **Recite, don't just listen.** Audio is for **learning pronunciation**. During a session the screen says *"Recite along"* and audio is **off by default**.
8. **Ruqyah for others:** child → hand on the head. Spouse / mahram → hand on the head. Non-mahram → they place their **own** hand while you recite (from video 10). Shown as guidance only.
9. **No diagnosis, no promises.** No symptom quizzes. Stories are labelled as stories.
10. **Medicine too:** the reminder *"Ruqyah and medicine go together"* appears on S1 and in About.
11. **Calendars:** dates shown in **Ethiopian and Gregorian** using the built-in Intl tools.

---

## 6. User flows

**F1 · First time (≈ 30 s):** open link → S1 language (Amharic preselected) → 2 calm screens → S2 Home → "Add to home screen" hint.

**F2 · Daily ruqyah (≈ 5 min):**
1. Home → **Start my ruqyah**
2. Intention
3. Aʿūdhu billāh + Bismillāh
4. Fātiḥah ×N
5. Āyat al-Kursī
6. Baqarah 285–286
7. Ikhlāṣ, Falaq, Nās ×3
8. Hand on the pain: Bismillāh ×3 + duʿāʾ ×7
9. Duas D2–D5
10. Blow & wipe
11. Complete: ring closes

**F3 · Pain right now (≈ 1 min):** Home → **Pain right now** → hand on the place of pain → Bismillāh ×3 → *aʿūdhu billāhi wa qudratihi…* ×7 → done.

**F4 · For my child:** Home → tile → short note (hand on head; Asmāʾ hadith) → Sunnah routine worded for another person (*arqīka*, *yashfīka*).

**F5 · Ruqyah water / olive oil:** Library → article → steps (recite close to the water, blow lightly, drink some and wash with the rest) → 🟡 label + what scholars say.

**F6 · Set a reminder:** Reminders → morning on, 06:30 → allow notifications → test notification arrives. If iPhone and not installed → shows "Add to Home Screen first" with 3 pictures.

---

## 7. Edge cases & messages (EN / AM; Amharic text to be reviewed)

| Case | What happens | English | Amharic |
|---|---|---|---|
| No internet, first open | Everything except audio works | "You're offline. Ruqyah works fully; audio needs internet the first time." | "ኢንተርኔት የለም። ሩቅያው ሙሉ በሙሉ ይሰራል፤ ድምጹ ለመጀመሪያ ጊዜ ኢንተርኔት ያስፈልገዋል።" |
| Audio fails | Retry button; session continues | "Audio didn't load. Recite from the text and try again later." (AUD-01) | "ድምጹ አልተጫነም። ከጽሑፉ ያንብቡ፣ በኋላ እንደገና ይሞክሩ።" |
| Notifications denied | Explain + calendar option | "Notifications are off. Turn them on in settings, or add a calendar reminder." (REM-01) | "ማሳወቂያዎች ጠፍተዋል። በቅንብሮች ያብሩ ወይም የቀን መቁጠሪያ ማስታወሻ ያክሉ።" |
| App closed mid-session | Resume prompt | "Continue where you stopped?" | "ካቆሙበት ይቀጥሉ?" |
| Phone date changed backwards | Never deletes history; day keys stay | — | — |
| New version deployed | Banner | "New version ready, tap to update." | "አዲስ ስሪት ዝግጁ ነው፤ ለማዘመን ይንኩ።" |
| Storage full / private mode | Warn; app still works for the session | "Progress can't be saved on this phone." (STO-01) | "እድገትዎ በዚህ ስልክ ላይ ሊቀመጥ አይችልም።" |
| Very long Amharic words | Wrap, never overflow at 360 px | — | — |

---

## 8. Non-goals (not in this app)

- Login, accounts, cloud backup of progress
- Symptom checker, "diagnose jinn / sihr / evil eye"
- Directory of rāqīs, booking, payments, ads, donations inside the app
- Re-uploading the TikTok videos (we link to the teachers instead)
- Full Quran reader (we show only ruqyah passages)

---

## 9. Data sources (verified before use)

| Need | Source | Note |
|---|---|---|
| **Quran Arabic text + Mushaf font** | **QPC Hafs** (King Fahd Complex) from **QUL by Tarteel** | The font needs its matching script text; self-hosted in the app. Font license: free use, no modification. |
| **Amharic meanings** | **Sadiq & Sani** translation on **QuranEnc** (Rowwad Translation Center) | Has XML/CSV/API; check Terms before import. |
| **English meanings** | Saheeh International (QuranEnc) | Check terms. |
| **Recitation audio** | Verse-by-verse files (e.g. EveryAyah / Al Quran Cloud CDN), reciter **[OPEN] Q5** | Audio copyright stays with its owners; cached on the phone after the first play. |
| **Duas** | Hisnul Muslim (al-Qaḥṭānī) + Bukhari / Muslim | Amharic meanings drafted, then **scholar-reviewed**. |
| **Scholars' rulings** | IslamQA (#3476), Standing Committee, Ibn Bāz, Ibn ʿUthaymīn, Ibn Ḥajar's 3 conditions | Shown in "Scholars' guidance". |

**Colours: "Morning sky" (healing, natural, light).** Final check in #04.

| Token | Light | Night |
|---|---|---|
| Background | Cloud white `#F7FAFC` | Deep night blue `#0E1B26` |
| Primary | Sky blue `#3A8FC0` | Soft sky `#7CC0E6` |
| Calm | Sage green `#7FAE8E` | `#9CC8A9` |
| Warm accent | Sand `#E8DCC2` | `#5A4E38` |
| Text | Ink `#16303F` | `#E8F1F6` |

---

## 10. Open questions → see chat (follow-up list)
1. Scholar reviewer · 2. Reminder type · 3. Dua audio · 4. Amharic-letter transliteration · 5. Reciter · 6. Extended routine visibility · 7. GitHub + package setting
