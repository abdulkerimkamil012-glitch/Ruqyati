import type { Routine, RoutineId } from './types';
import { quls, s } from './routine-kit';
import { complete, eye, fear, water } from './routines-more';

/** ✅ Default: Sunnah only (videos 1, 3, 4, 5, 9, 10). */
const sunnah: Routine = {
  id: 'sunnah', minutes: 6, label: 'sunnah',
  steps: [
    s('intention', 'intention', undefined, 1, 'sunnah', { noteKey: 'noteIntention', source: 'Bukhari 1' }),
    s('istiadha', 'dua', 'istiadha', 1, 'sunnah', { source: 'Quran 16:98' }),
    s('fatiha', 'passage', 'fatiha', 3, 'sunnah', { noteKey: 'noteFatiha', source: 'Bukhari 5749 · Muslim 2201' }),
    s('kursi', 'passage', 'kursi', 1, 'sunnah', { noteKey: 'noteKursi', source: 'Bukhari 2311' }),
    s('baqarah', 'passage', 'baqarahEnd2', 1, 'sunnah', { noteKey: 'noteBaqarah', source: 'Bukhari 5009 · Muslim 807' }),
    ...quls(),
    s('blowWipe', 'blowWipe', undefined, 1, 'sunnah', { noteKey: 'noteBlowWipe', source: 'Bukhari 5017, 5751' }),
    s('bismillah3', 'dua', 'bismillah3', 3, 'sunnah', { noteKey: 'notePain', source: 'Muslim 2202' }),
    s('painRefuge', 'dua', 'painRefuge', 7, 'sunnah', { noteKey: 'notePain', source: 'Muslim 2202' }),
    s('kalimat', 'dua', 'kalimat', 3, 'sunnah', { source: 'Muslim 2708' }),
    s('adhhib', 'dua', 'adhhib', 3, 'sunnah', { source: 'Bukhari 5743 · Muslim 2191' }),
    s('jibrilSelf', 'dua', 'jibrilSelf', 3, 'sunnah', { source: 'Muslim 2186' }),
  ],
};

/** 🟡 Extended daily list from video 7 (teacher: "experienced āyāt", no specific hadith). */
const extended: Routine = {
  id: 'extended', minutes: 20, label: 'experience',
  steps: [
    s('noteExp', 'note', undefined, 1, 'experience', { noteKey: 'noteExperience', source: 'Muslim 2200' }),
    s('istiadha', 'dua', 'istiadha', 1, 'sunnah', { source: 'Quran 16:98' }),
    s('fatiha', 'passage', 'fatiha', 7, 'sunnah', { noteKey: 'noteFatiha', source: 'Bukhari 5749 · Muslim 2201' }),
    s('baqarah3', 'passage', 'baqarahEnd3', 1, 'sunnah', { noteKey: 'noteBaqarah', source: 'Bukhari 5009 · Muslim 807' }),
    s('kursi', 'passage', 'kursi', 1, 'sunnah', { noteKey: 'noteKursi', source: 'Bukhari 2311' }),
    s('imranStart', 'passage', 'imranStart', 1, 'experience'),
    s('imranEnd', 'passage', 'imranEnd', 1, 'experience'),
    s('saffat', 'passage', 'saffat', 1, 'experience'),
    s('jinn', 'passage', 'jinn', 1, 'experience'),
    s('hashrEnd', 'passage', 'hashrEnd', 1, 'experience'),
    s('qalamEnd', 'passage', 'qalamEnd', 1, 'experience'),
    s('kahf39', 'passage', 'kahf39', 7, 'experience'),
    ...quls(),
    s('blowWipe', 'blowWipe', undefined, 1, 'sunnah', { noteKey: 'noteBlowWipe', source: 'Bukhari 5017, 5751' }),
    s('adhhib', 'dua', 'adhhib', 3, 'sunnah', { source: 'Bukhari 5743 · Muslim 2191' }),
    s('jibrilSelf', 'dua', 'jibrilSelf', 3, 'sunnah', { source: 'Muslim 2186' }),
  ],
};

/** ✅ For a child, spouse or mahram (videos 7, 10; Asmāʾ hadith, Muslim 2198). */
const other: Routine = {
  id: 'other', minutes: 6, label: 'sunnah',
  steps: [
    s('handOnHead', 'handOnHead', undefined, 1, 'sunnah', { noteKey: 'noteForOther', source: 'Muslim 2198' }),
    s('istiadha', 'dua', 'istiadha', 1, 'sunnah', { source: 'Quran 16:98' }),
    s('fatiha', 'passage', 'fatiha', 3, 'sunnah', { noteKey: 'noteFatiha', source: 'Bukhari 5749 · Muslim 2201' }),
    s('kursi', 'passage', 'kursi', 1, 'sunnah', { noteKey: 'noteKursi', source: 'Bukhari 2311' }),
    s('baqarah', 'passage', 'baqarahEnd2', 1, 'sunnah', { noteKey: 'noteBaqarah', source: 'Bukhari 5009 · Muslim 807' }),
    ...quls(),
    s('blowWipe', 'blowWipe', undefined, 1, 'sunnah', { noteKey: 'noteBlowWipe', source: 'Bukhari 5751' }),
    s('jibrilOther', 'dua', 'jibrilOther', 3, 'sunnah', { source: 'Muslim 2186' }),
    s('yubrik', 'dua', 'yubrik', 3, 'sunnah', { source: 'Muslim 2185' }),
    s('hammaOther', 'dua', 'hammaOther', 3, 'sunnah', { noteKey: 'noteChild', source: 'Bukhari 3371' }),
    s('asalu', 'dua', 'asalu', 7, 'sunnah', { source: 'Abu Dawud 3106 · Tirmidhi 2083' }),
    s('adhhib', 'dua', 'adhhib', 3, 'sunnah', { source: 'Bukhari 5743 · Muslim 2191' }),
  ],
};

/** ✅ Pain right now (Muslim 2202). */
const pain: Routine = {
  id: 'pain', minutes: 1, label: 'sunnah',
  steps: [
    s('bismillah3', 'dua', 'bismillah3', 3, 'sunnah', { noteKey: 'notePain', source: 'Muslim 2202' }),
    s('painRefuge', 'dua', 'painRefuge', 7, 'sunnah', { noteKey: 'notePain', source: 'Muslim 2202' }),
  ],
};

export const ROUTINES: Record<RoutineId, Routine> = { sunnah, extended, complete, pain, fear, eye, water, other };

/** How Home groups the routines. */
export const ROUTINE_GROUPS: { id: 'daily' | 'needed' | 'loved'; ids: RoutineId[] }[] = [
  { id: 'daily', ids: ['sunnah', 'extended', 'complete'] },
  { id: 'needed', ids: ['pain', 'fear', 'eye', 'water'] },
  { id: 'loved', ids: ['other'] },
];
