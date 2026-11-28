import { describe, expect, it } from 'vitest';
import { DUAS } from './duas';
import { DUA_AM_PRON } from './duas-am';
import { DEFAULT_SETTINGS } from '../lib/db';

describe('Amharic pronunciation of duʿāʾs', () => {
  it('every duʿāʾ has one, written only in Amharic letters', () => {
    for (const id of Object.keys(DUAS)) {
      const p = DUA_AM_PRON[id];
      expect(p, id).toBeTruthy();
      expect(p, id).not.toMatch(/[A-Za-z؀-ۿ]/);
      expect(p, id).toMatch(/^[ሀ-፿\s፣።\-]+$/);
    }
  });

  it('has no entry for Quran passages (Quran is read from the Arabic text)', () => {
    expect(Object.keys(DUA_AM_PRON).sort()).toEqual(Object.keys(DUAS).sort());
  });

  it('is switched on by default and can be turned off', () => {
    expect(DEFAULT_SETTINGS.amPron).toBe(true);
  });
});
