import type { NoteKey, Step } from './types';

export const s = (id: string, kind: Step['kind'], ref: string | undefined, count: Step['count'], label: Step['label'], extra: Partial<Step> = {}): Step =>
  ({ id, kind, ref, count, label, ...extra });

/** al-Ikhlāṣ, al-Falaq, an-Nās. */
export const quls = (label: Step['label'] = 'sunnah', noteKey: NoteKey = 'noteQuls', source = 'Bukhari 5017, 5751'): Step[] => [
  s('ikhlas', 'passage', 'ikhlas', 3, label, { noteKey, source }),
  s('falaq', 'passage', 'falaq', 3, label, { noteKey, source }),
  s('nas', 'passage', 'nas', 3, label, { noteKey, source }),
];

export const SRC = {
  fatiha: 'Bukhari 5749 · Muslim 2201',
  kursi: 'Bukhari 2311',
  baqarah: 'Bukhari 5009 · Muslim 807',
  blowWipe: 'Bukhari 5017, 5751',
  adhhib: 'Bukhari 5743 · Muslim 2191',
  waterSalt: 'aṭ-Ṭabarānī, al-Awsaṭ 5890 · al-Albani, as-Ṣaḥīḥah 548',
  waterFatwa: 'Ibn Bāz, Majmūʿ al-Fatāwā · al-Lajnah ad-Dāʾimah',
  twoSources: 'أطباء الحرمين · Al Bayan (sifted)',
};
