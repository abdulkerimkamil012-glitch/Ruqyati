import { describe, expect, it } from 'vitest';
import { QURAN, passage } from './quran';
import { DUAS } from './duas';
import { ROUTINES, ROUTINE_GROUPS } from './routines';
import { ARTICLES } from './articles';
import type { RoutineId } from './types';

describe('content sifted from the two sources (أطباء الحرمين, Al Bayan)', () => {
  it('never contains al-Baqarah 2:20 (no basis for using it against the eye)', () => {
    for (const p of Object.values(QURAN.passages))
      if (p.surah === 2) expect(p.from <= 20 && p.to >= 20, `${p.from}-${p.to}`).toBe(false);
  });

  it('has the sihr and healing passages with the right ayah counts', () => {
    expect(passage('araf117').ayahs).toHaveLength(6);
    expect(passage('yunus79').ayahs).toHaveLength(4);
    expect(passage('taha65').ayahs).toHaveLength(5);
    expect(passage('muminun115').ayahs).toHaveLength(4);
    expect(passage('kafirun').ayahs).toHaveLength(6);
  });

  it('keeps only authentic duas, each with its collection and number', () => {
    for (const id of ['hammaSelf', 'hammaOther', 'yubrik', 'khanbash', 'fazaa', 'hamz', 'laYadurr', 'karb', 'salawat'])
      expect(DUAS[id]?.source, id).toMatch(/\d/);
  });

  it('leaves out the wordings that are not established', () => {
    const all = Object.values(DUAS).map((d) => d.ar).join(' ');
    expect(all).not.toContain('تحصنت');
    expect(all).not.toContain('حسبي الرب');
  });

  it('the fear and evil-eye routines are ✅ only', () => {
    for (const id of ['fear', 'eye'] as RoutineId[]) {
      expect(ROUTINES[id].label).toBe('sunnah');
      expect(ROUTINES[id].steps.every((s) => s.label === 'sunnah'), id).toBe(true);
    }
  });

  it('a routine is labelled ✅ only when every step is ✅', () => {
    for (const r of Object.values(ROUTINES))
      if (r.label === 'sunnah') expect(r.steps.every((s) => s.label === 'sunnah'), r.id).toBe(true);
  });

  it('the water routine follows ʿAlī’s hadith: al-Kāfirūn, al-Falaq and an-Nās', () => {
    const refs = ROUTINES.water.steps.map((s) => s.ref);
    for (const r of ['kafirun', 'falaq', 'nas']) expect(refs).toContain(r);
    expect(ROUTINES.water.steps.some((s) => s.kind === 'blowWater')).toBe(true);
    expect(ROUTINES.water.steps.some((s) => s.kind === 'useWater')).toBe(true);
  });

  it('the child routine uses the Prophet’s own words for al-Ḥasan and al-Ḥusayn', () => {
    expect(ROUTINES.other.steps.map((s) => s.ref)).toContain('hammaOther');
  });

  it('every routine appears in exactly one home group', () => {
    const grouped = ROUTINE_GROUPS.flatMap((g) => g.ids);
    expect([...grouped].sort()).toEqual(Object.keys(ROUTINES).sort());
  });

  it('has the sifting article listing what was left out', () => {
    const a = ARTICLES.find((x) => x.id === 'sifted');
    expect(a).toBeDefined();
    expect(a!.body.en.join(' ')).toMatch(/2:20/);
  });
});
