// Routines added after sifting the owner's two sources (أطباء الحرمين PDF, Al Bayan article).
// Rule: a routine is ✅ only when every step is ✅. Counts above 1 that no hadith fixes are teachers' practice.
import type { NoteKey, Routine } from './types';
import { quls, s, SRC } from './routine-kit';

/** ✅ Fear, worry and bad dreams: only authentic words. */
export const fear: Routine = {
  id: 'fear', minutes: 4, label: 'sunnah',
  steps: [
    s('fazaa', 'dua', 'fazaa', 1, 'sunnah', { noteKey: 'noteFear', source: 'Tirmidhi 3528 · Abu Dawud 3893' }),
    s('karb', 'dua', 'karb', 1, 'sunnah', { noteKey: 'noteKarb', source: 'Bukhari 6346 · Muslim 2730' }),
    s('kursi', 'passage', 'kursi', 1, 'sunnah', { noteKey: 'noteKursi', source: SRC.kursi }),
    s('baqarah', 'passage', 'baqarahEnd2', 1, 'sunnah', { noteKey: 'noteBaqarah', source: SRC.baqarah }),
    ...quls(),
    s('blowWipe', 'blowWipe', undefined, 1, 'sunnah', { noteKey: 'noteBlowWipe', source: SRC.blowWipe }),
    s('khanbash', 'dua', 'khanbash', 1, 'sunnah', { source: 'Ahmad 15460 · as-Ṣaḥīḥah 2995' }),
  ],
};

/** ✅ Evil eye and envy, for yourself. */
export const eye: Routine = {
  id: 'eye', minutes: 5, label: 'sunnah',
  steps: [
    s('eyeWash', 'note', undefined, 1, 'sunnah', { titleKey: 'step_eyeWash', noteKey: 'noteEyeWash', source: 'Muslim 2188 · Ibn Majah 3509' }),
    s('istiadha', 'dua', 'istiadha', 1, 'sunnah', { source: 'Quran 16:98' }),
    s('fatiha', 'passage', 'fatiha', 3, 'sunnah', { noteKey: 'noteFatiha', source: SRC.fatiha }),
    ...quls('sunnah', 'noteEyeQuls', 'Tirmidhi 2058 · Bukhari 5017'),
    s('blowWipe', 'blowWipe', undefined, 1, 'sunnah', { noteKey: 'noteBlowWipe', source: SRC.blowWipe }),
    s('hammaSelf', 'dua', 'hammaSelf', 3, 'sunnah', { source: 'Bukhari 3371' }),
    s('jibrilSelf', 'dua', 'jibrilSelf', 3, 'sunnah', { source: 'Muslim 2186' }),
    s('adhhib', 'dua', 'adhhib', 3, 'sunnah', { source: SRC.adhhib }),
  ],
};

/** 🟡 Ruqyah on water: ʿAlī’s hadith is ✅, reciting over drinking water is scholars' permission. */
export const water: Routine = {
  id: 'water', minutes: 8, label: 'experience',
  steps: [
    s('intention', 'intention', undefined, 1, 'sunnah', { noteKey: 'noteIntention', source: 'Bukhari 1' }),
    s('noteWater', 'note', undefined, 1, 'experience', { noteKey: 'noteWater', source: SRC.waterFatwa }),
    s('waterSalt', 'note', undefined, 1, 'sunnah', { titleKey: 'step_waterSalt', noteKey: 'noteWaterSalt', source: SRC.waterSalt }),
    s('fatiha', 'passage', 'fatiha', 3, 'sunnah', { noteKey: 'noteFatiha', source: SRC.fatiha }),
    s('kursi', 'passage', 'kursi', 1, 'sunnah', { noteKey: 'noteKursi', source: SRC.kursi }),
    s('kafirun', 'passage', 'kafirun', 1, 'sunnah', { source: SRC.waterSalt }),
    ...quls('sunnah', 'noteQuls', `${SRC.blowWipe} · as-Ṣaḥīḥah 548`),
    s('blowWater', 'blowWater', undefined, 1, 'experience', { noteKey: 'noteBlowWater', source: SRC.waterFatwa }),
    s('useWater', 'useWater', undefined, 1, 'experience', { noteKey: 'noteUseWater', source: SRC.waterFatwa }),
    s('adhhib', 'dua', 'adhhib', 3, 'sunnah', { source: SRC.adhhib }),
  ],
};

const exp = (id: string, ref: string, noteKey?: NoteKey) =>
  s(id, 'passage', ref, 1, 'experience', noteKey ? { noteKey } : {});

/** 🟡 The complete list from the two sources, sifted: authentic items kept ✅, verses chosen by teachers 🟡, unproven items removed. */
export const complete: Routine = {
  id: 'complete', minutes: 25, label: 'experience',
  steps: [
    s('noteComplete', 'note', undefined, 1, 'experience', { titleKey: 'step_sifted', noteKey: 'noteComplete', source: SRC.twoSources }),
    s('hamz', 'dua', 'hamz', 1, 'sunnah', { source: 'Abu Dawud 775' }),
    s('fatiha', 'passage', 'fatiha', 3, 'sunnah', { noteKey: 'noteFatiha', source: SRC.fatiha }),
    exp('baqarahStart', 'baqarahStart'),
    exp('baqarah102', 'baqarah102', 'noteSihr'),
    exp('baqarah163', 'baqarah163'),
    s('kursi', 'passage', 'kursi', 1, 'sunnah', { noteKey: 'noteKursi', source: SRC.kursi }),
    s('baqarah', 'passage', 'baqarahEnd2', 1, 'sunnah', { noteKey: 'noteBaqarah', source: SRC.baqarah }),
    exp('imran190', 'imran190'),
    exp('araf54', 'araf54'),
    exp('araf117', 'araf117', 'noteSihr'),
    exp('yunus79', 'yunus79', 'noteSihr'),
    exp('taha65', 'taha65', 'noteSihr'),
    exp('muminun115', 'muminun115'),
    exp('saffat', 'saffat'),
    exp('hashrEnd', 'hashrEnd'),
    exp('isra82', 'isra82'),
    exp('mulk3', 'mulk3', 'noteEyeVerse'),
    exp('qalamEnd', 'qalamEnd', 'noteEyeVerse'),
    exp('jinn3', 'jinn3'),
    s('kafirun', 'passage', 'kafirun', 1, 'sunnah', { source: SRC.waterSalt }),
    ...quls(),
    s('blowWipe', 'blowWipe', undefined, 1, 'sunnah', { noteKey: 'noteBlowWipe', source: SRC.blowWipe }),
    s('kalimat', 'dua', 'kalimat', 3, 'sunnah', { source: 'Muslim 2708' }),
    s('hammaSelf', 'dua', 'hammaSelf', 3, 'sunnah', { source: 'Bukhari 3371' }),
    s('khanbash', 'dua', 'khanbash', 1, 'sunnah', { source: 'Ahmad 15460 · as-Ṣaḥīḥah 2995' }),
    s('laYadurr', 'dua', 'laYadurr', 3, 'sunnah', { source: 'Abu Dawud 5088 · Tirmidhi 3388' }),
    s('adhhib', 'dua', 'adhhib', 3, 'sunnah', { source: SRC.adhhib }),
    s('jibrilSelf', 'dua', 'jibrilSelf', 3, 'sunnah', { source: 'Muslim 2186' }),
    s('salawat', 'dua', 'salawat', 1, 'sunnah', { noteKey: 'noteSalawat', source: 'Bukhari 3370 · Tirmidhi 3477' }),
  ],
};
