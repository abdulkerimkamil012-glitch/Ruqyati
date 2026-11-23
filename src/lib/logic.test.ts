import { describe, expect, it } from 'vitest';
import { addDays, dayKey, formatEthiopian, formatGregorian } from './dates';
import { doneInLast30, streak } from './streak';
import { buildIcs, googleCalendarUrl, isValidTime } from './reminder';
import { reached, tap } from './counter';

const T = '2026-11-23';
const set = (...offsets: number[]) => new Set(offsets.map((o) => addDays(T, -o)));

describe('dates', () => {
  it('builds local day keys and adds days across months', () => {
    expect(dayKey(new Date(2026, 10, 23, 23, 50))).toBe('2026-11-23');
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });
  it('formats with western digits', () => {
    expect(formatGregorian(T, 'ar')).toMatch(/23/);
    expect(formatEthiopian(T, 'en')).toMatch(/\d/);
    expect(formatEthiopian(T, 'ar')).not.toMatch(/[٠-٩]/);
  });
});

describe('streak (spec §5.6)', () => {
  it('is 0 with nothing done', () => expect(streak(new Set(), T).days).toBe(0));
  it('counts consecutive days including today', () => expect(streak(set(0, 1, 2), T).days).toBe(3));
  it('today not done yet does not break it', () => expect(streak(set(1, 2), T).days).toBe(2));
  it('spec example: 6 done, 1 missed, 1 done = 8 with rest used', () => {
    const r = streak(set(0, 2, 3, 4, 5, 6, 7), T);
    expect(r).toEqual({ days: 8, restUsed: true });
  });
  it('two missed days in a row break it', () => expect(streak(set(0, 3, 4), T).days).toBe(1));
  it('only one rest day per 7 days', () => expect(streak(set(0, 2, 4, 5), T).days).toBe(3));
  it('rest days a week apart are both forgiven', () => {
    const d = set(0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 16);
    expect(streak(d, T).days).toBe(17);
  });
  it('counts done days in the last 30', () => expect(doneInLast30(set(0, 1, 29, 30), T)).toBe(3));
});

describe('reminder', () => {
  const r = { time: '06:30', title: 'Ruqyah, time', details: 'Open the app', url: 'https://x.app', start: new Date(2026, 10, 24) };
  it('builds a daily ics with an alarm', () => {
    const ics = buildIcs(r);
    expect(ics).toContain('DTSTART:20261124T063000');
    expect(ics).toContain('DTEND:20261124T064000');
    expect(ics).toContain('RRULE:FREQ=DAILY');
    expect(ics).toContain('SUMMARY:Ruqyah\\, time');
    expect(ics).toContain('\r\n');
  });
  it('wraps the end time past midnight', () => {
    expect(buildIcs({ ...r, time: '23:55' })).toContain('DTEND:20261124T000500');
  });
  it('builds a google calendar link', () => {
    const u = new URL(googleCalendarUrl(r));
    expect(u.searchParams.get('recur')).toBe('RRULE:FREQ=DAILY');
    expect(u.searchParams.get('dates')).toBe('20261124T063000/20261124T064000');
  });
  it('validates times', () => {
    expect(isValidTime('06:30')).toBe(true);
    expect(isValidTime('24:00')).toBe(false);
    expect(isValidTime('6:30')).toBe(false);
  });
});

describe('counter', () => {
  it('debounces double taps', () => {
    let s = { count: 0, lastTap: -1000 };
    s = tap(s, 0);
    s = tap(s, 100);
    s = tap(s, 300);
    expect(s.count).toBe(2);
  });
  it('knows when the target is reached', () => {
    expect(reached(3, 3)).toBe(true);
    expect(reached(2, 3)).toBe(false);
    expect(reached(99, 'free')).toBe(false);
  });
});
