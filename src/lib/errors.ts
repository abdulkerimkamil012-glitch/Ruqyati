import type { Key } from '../i18n/en';

export type ErrorCode = 'STO01' | 'AUD01' | 'GEN01';

export const errorKey = (code: ErrorCode): Key => `err_${code}` as Key;

/** Runs a storage call; on failure reports STO01 and returns the fallback. The app keeps working. */
export async function safe<T>(fn: () => Promise<T>, fallback: T, report: (c: ErrorCode) => void): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.warn('[ruqyati] storage', e);
    report('STO01');
    return fallback;
  }
}
