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

/** Free counting fills the ring in rounds of 33, like a tasbīḥ. */
export const FREE_ROUND = 33;

/** How many ring segments to draw and how many are filled. One tap fills one segment. */
export function ring(count: number, target: Target): { segments: number; filled: number } {
  if (target !== 'free') return { segments: target, filled: Math.min(count, target) };
  const filled = count === 0 ? 0 : ((count - 1) % FREE_ROUND) + 1;
  return { segments: FREE_ROUND, filled };
}
