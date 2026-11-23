// Local-day helpers. A "day key" is the user's local calendar date: YYYY-MM-DD.

const pad = (n: number) => String(n).padStart(2, '0');

export function dayKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12); // midday avoids DST edges
}

export function addDays(key: string, n: number): string {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return dayKey(d);
}

export type Lang = 'am' | 'ar' | 'en';

const LOCALE: Record<Lang, string> = { am: 'am-ET', ar: 'ar', en: 'en-GB' };

/** Gregorian date, Western digits. */
export function formatGregorian(key: string, lang: Lang, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }): string {
  return new Intl.DateTimeFormat(`${LOCALE[lang]}-u-nu-latn`, opts).format(fromKey(key));
}

/** Ethiopian calendar date, Western digits. Falls back to Gregorian if the browser lacks it. */
export function formatEthiopian(key: string, lang: Lang, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }): string {
  try {
    return new Intl.DateTimeFormat(`${LOCALE[lang]}-u-ca-ethiopic-nu-latn`, opts).format(fromKey(key));
  } catch {
    return formatGregorian(key, lang, opts);
  }
}
