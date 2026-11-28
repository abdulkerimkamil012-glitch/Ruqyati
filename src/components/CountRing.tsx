import { ring, type Target } from '../lib/counter';

const R = 66;
const C = 2 * Math.PI * R;

/** Segmented ring around the counter: each tap fills the next segment. */
export function CountRing({ count, target, done }: { count: number; target: Target; done: boolean }) {
  const { segments, filled } = ring(count, target);
  const gap = segments === 1 ? 0 : segments > 10 ? 2.5 : 7;
  const len = C / segments - gap;
  return (
    <svg viewBox="0 0 144 144" aria-hidden className="pointer-events-none absolute inset-0 size-full -rotate-90">
      {Array.from({ length: segments }, (_, i) => {
        const on = i < filled;
        return (
          <circle key={i} cx="72" cy="72" r={R} fill="none" strokeLinecap={segments > 10 ? 'butt' : 'round'}
            strokeWidth={on ? 9 : 6}
            strokeDasharray={`${len} ${C - len}`}
            strokeDashoffset={-(i * (C / segments)) - gap / 2}
            className={`transition-[stroke,stroke-width] duration-300 ease-out ${on ? (done ? 'stroke-[var(--calm)]' : 'stroke-[var(--accent)]') : 'stroke-[var(--line)]'} ${on && i === filled - 1 ? 'seg-pop' : ''}`} />
        );
      })}
    </svg>
  );
}
