import data from './quran.json';

export interface Ayah { s: number; a: number; ar: string; am: string; en: string; tr: string }
export interface Passage { surah: number; nameAr: string; nameEn: string; from: number; to: number; ayahs: Ayah[] }

export const QURAN = data as { meta: { arabicSha256: string; generated: string }; passages: Record<string, Passage> };

export function passage(id: string): Passage {
  const p = QURAN.passages[id];
  if (!p) throw new Error(`Unknown passage ${id}`);
  return p;
}

/** Whole surahs (from ayah 1, not al-Fātiḥah) are read with the basmala before them. */
export function needsBasmala(p: Passage): boolean {
  return p.from === 1 && p.surah !== 1 && p.surah !== 9;
}

const pad3 = (n: number) => String(n).padStart(3, '0');
export const audioUrl = (a: Ayah) => `https://everyayah.com/data/Alafasy_128kbps/${pad3(a.s)}${pad3(a.a)}.mp3`;
