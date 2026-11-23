import { addDays } from './dates';

/**
 * Streak in calendar days. Rules (spec §5.6):
 * - Today not done yet does not break the streak (count from yesterday).
 * - One missed day is forgiven as a "rest day" if it sits between two done days
 *   and no other rest day was used in the 6 days after it (max one rest per 7 days).
 * - A rest day counts as a day of the streak.
 */
export function streak(done: Set<string>, today: string): { days: number; restUsed: boolean } {
  let start = today;
  if (!done.has(today)) start = addDays(today, -1);
  let days = 0;
  let lastRest = -Infinity;
  let restUsed = false;
  for (let i = 0; ; i++) {
    const day = addDays(start, -i);
    if (done.has(day)) {
      days++;
      continue;
    }
    const before = addDays(day, -1);
    const canRest = i > 0 && i - lastRest >= 7 && done.has(before);
    if (!canRest) break;
    lastRest = i;
    restUsed = true;
    days++;
  }
  return { days, restUsed };
}

/** Days done within the last 30 days, including today. */
export function doneInLast30(done: Set<string>, today: string): number {
  let n = 0;
  for (let i = 0; i < 30; i++) if (done.has(addDays(today, -i))) n++;
  return n;
}
