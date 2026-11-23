export type Target = 1 | 3 | 7 | 'free';
export const TARGETS: Target[] = [1, 3, 7, 'free'];

export interface CounterState {
  count: number;
  lastTap: number;
}

export const DEBOUNCE_MS = 150;

/** Registers a tap. Taps closer than 150 ms count once. */
export function tap(s: CounterState, now: number): CounterState {
  if (now - s.lastTap < DEBOUNCE_MS) return s;
  return { count: s.count + 1, lastTap: now };
}

export function reached(count: number, target: Target): boolean {
  return target !== 'free' && count >= target;
}
