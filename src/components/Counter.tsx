import { useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { reached, tap, TARGETS, type Target } from '../lib/counter';
import { useApp } from '../state/app';
import { CountRing } from './CountRing';

/** Big tap circle. Count resets when the step changes (parent gives a new key). */
export function Counter({ target, onTarget, onCount, onTargetChange }: {
  target: Target;
  onTarget: () => void;
  onCount: (n: number) => void;
  onTargetChange: (t: Target) => void;
}) {
  const { t } = useApp();
  const state = useRef({ count: 0, lastTap: -1000 });
  const [count, setCount] = useState(0);
  const [pulse, setPulse] = useState(0);
  const isDone = reached(count, target);

  const press = () => {
    const next = tap(state.current, performance.now());
    if (next === state.current) return;
    state.current = next;
    setCount(next.count);
    setPulse((p) => p + 1);
    onCount(next.count);
    if (target !== 'free' && next.count === target) {
      navigator.vibrate?.([30, 60, 30]);
      onTarget();
    } else navigator.vibrate?.(12);
  };

  return (
    <div className="flex items-center gap-3">
      <div role="radiogroup" aria-label={t('tapToCount')} className="flex flex-col gap-1">
        {TARGETS.map((x) => (
          <button key={String(x)} role="radio" aria-checked={x === target} onClick={() => onTargetChange(x)}
            className={`h-8 w-12 rounded-lg text-xs font-extrabold ${x === target ? 'bg-[var(--accent)] text-[var(--accent-ink)]' : 'bg-[var(--line)]/70 text-[var(--muted)]'}`}>
            {x === 'free' ? t('countFree') : t('countTimes', { n: x })}
          </button>
        ))}
      </div>
      <button onClick={press} aria-label={`${t('tapToCount')}: ${count}`}
        className={`relative grid size-36 shrink-0 select-none place-items-center rounded-full transition active:scale-95 ${isDone ? 'bg-[var(--calm-soft)]' : 'bg-[var(--surface)]'}`}>
        <CountRing count={count} target={target} done={isDone} />
        {pulse > 0 && <span key={pulse} className="ripple pointer-events-none absolute inset-2 rounded-full border-2 border-[var(--accent)]" />}
        <span className="flex flex-col items-center">
          {isDone ? <Check size={44} className="count-pop text-[var(--calm)]" /> : (
            <span key={count} className="count-pop text-5xl font-black tabular-nums">{count}</span>
          )}
          <span dir="ltr" className="text-xs font-bold text-[var(--muted)]">
            {target === 'free' ? t('recitedTimes', { n: count }) : `${Math.min(count, target)} / ${target}`}
          </span>
        </span>
      </button>
    </div>
  );
}
