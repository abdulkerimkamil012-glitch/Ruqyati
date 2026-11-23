import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { QURAN, needsBasmala, passage, audioUrl } from './quran';
import { DUAS } from './duas';
import { ROUTINES } from './routines';
import { ARTICLES } from './articles';
import { en } from '../i18n/en';
import { am } from '../i18n/am';
import { ar } from '../i18n/ar';

describe('quran.json integrity', () => {
  it('matches the checksum written by the import script', () => {
    const h = createHash('sha256');
    for (const p of Object.values(QURAN.passages)) for (const a of p.ayahs) h.update(`${a.s}:${a.a}|${a.ar}\n`);
    expect(h.digest('hex')).toBe(QURAN.meta.arabicSha256);
  });
  it('has every ayah with all four texts', () => {
    for (const p of Object.values(QURAN.passages)) {
      expect(p.ayahs.length).toBe(p.to - p.from + 1);
      for (const a of p.ayahs) for (const f of [a.ar, a.am, a.en, a.tr]) expect(f.length).toBeGreaterThan(1);
    }
  });
  it('knows famous ayah counts', () => {
    expect(passage('fatiha').ayahs).toHaveLength(7);
    expect(passage('jinn').ayahs).toHaveLength(28);
    expect(passage('nas').ayahs).toHaveLength(6);
  });
  it('adds the basmala before whole surahs but not al-Fātiḥah or partial passages', () => {
    expect(needsBasmala(passage('ikhlas'))).toBe(true);
    expect(needsBasmala(passage('fatiha'))).toBe(false);
    expect(needsBasmala(passage('kursi'))).toBe(false);
  });
  it('builds verse audio urls', () => {
    expect(audioUrl(passage('kursi').ayahs[0])).toBe('https://everyayah.com/data/Alafasy_128kbps/002255.mp3');
  });
});

describe('routines', () => {
  it('every step points to real content', () => {
    for (const r of Object.values(ROUTINES))
      for (const s of r.steps) {
        if (s.kind === 'passage') expect(QURAN.passages[s.ref!], `${r.id}/${s.id}`).toBeDefined();
        if (s.kind === 'dua') expect(DUAS[s.ref!], `${r.id}/${s.id}`).toBeDefined();
      }
  });
  it('the default Sunnah routine contains ✅ items only', () => {
    expect(ROUTINES.sunnah.steps.every((s) => s.label === 'sunnah')).toBe(true);
  });
  it('the extended routine starts with its experience note', () => {
    expect(ROUTINES.extended.steps[0].noteKey).toBe('noteExperience');
  });
  it('every sunnah step names its source', () => {
    for (const r of Object.values(ROUTINES))
      for (const s of r.steps) if (s.label === 'sunnah') expect(s.source, `${r.id}/${s.id}`).toBeTruthy();
  });
  it('duas have all languages and a source', () => {
    for (const d of Object.values(DUAS)) for (const f of [d.ar, d.tr, d.en, d.am, d.source]) expect(f.length).toBeGreaterThan(1);
  });
  it('articles have all three languages with equal bullet counts', () => {
    for (const a of ARTICLES) {
      expect(a.body.am.length).toBe(a.body.en.length);
      expect(a.body.ar.length).toBe(a.body.en.length);
    }
  });
});

describe('i18n', () => {
  it('am and ar have every english key and keep {placeholders}', () => {
    for (const [k, v] of Object.entries(en)) {
      const vars = v.match(/\{\w+\}/g) ?? [];
      for (const d of [am, ar]) {
        const t = (d as Record<string, string>)[k];
        expect(t, k).toBeTruthy();
        for (const x of vars) expect(t, `${k} ${x}`).toContain(x);
      }
    }
  });
});
