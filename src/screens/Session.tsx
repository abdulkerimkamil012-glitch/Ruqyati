import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { ROUTINES } from '../content/routines';
import type { RoutineId } from '../content/types';
import type { Target } from '../lib/counter';
import { useApp } from '../state/app';
import { useNav } from '../state/nav';
import { Counter } from '../components/Counter';
import { StepBadge, StepContent, StepTitle } from '../components/StepContent';
import { Button, Toast } from '../components/ui';

const COUNTED = new Set(['passage', 'dua']);

export function Session({ sessionId, routineId }: { sessionId: string; routineId: RoutineId }) {
  const { t, sessions, saveStep, complete, settings } = useApp();
  const { back, replace } = useNav();
  const session = sessions.find((s) => s.id === sessionId);
  const routine = ROUTINES[routineId];
  const [index, setIndex] = useState(session?.stepIndex ?? 0);
  const [targets, setTargets] = useState<Record<string, Target>>({});
  const [leaving, setLeaving] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const topRef = useRef<HTMLDivElement>(null);

  const step = routine.steps[index];
  const last = index === routine.steps.length - 1;
  const target = targets[step.id] ?? step.count;

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    topRef.current?.scrollIntoView({ block: 'start' });
    window.scrollTo(0, 0);
  }, [index]);

  if (!session) return null;

  const goTo = (i: number) => {
    window.clearTimeout(timer.current);
    setIndex(i);
    saveStep(session, i);
  };
  const next = () => {
    if (last) {
      window.clearTimeout(timer.current);
      complete(session);
      replace({ name: 'complete' });
    } else goTo(index + 1);
  };
  const onTarget = () => {
    if (settings.autoNext) timer.current = window.setTimeout(next, 800);
  };

  return (
    <main className="flex min-h-dvh flex-col" ref={topRef}>
      <header className="sticky top-0 z-20 bg-[var(--bg)]/95 px-4 pt-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button onClick={() => setLeaving(true)} aria-label={t('close')} className="grid size-10 place-items-center rounded-full bg-[var(--line)]/60"><X size={20} /></button>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--line)]" role="progressbar" aria-valuemin={1} aria-valuemax={routine.steps.length} aria-valuenow={index + 1}>
            <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${((index + 1) / routine.steps.length) * 100}%` }} />
          </div>
          <span dir="ltr" className="text-sm font-bold tabular-nums text-[var(--muted)]">{t('stepOf', { n: index + 1, total: routine.steps.length })}</span>
        </div>
        <h1 className="mt-3 text-xl font-extrabold"><StepTitle step={step} /></h1>
        <div className="mt-2 pb-3"><StepBadge step={step} /></div>
      </header>

      <section key={step.id + index} className="rise flex-1 px-4 pb-6">
        <StepContent step={step} onAudioError={() => setAudioError(true)} />
      </section>

      <footer className="pb-safe sticky bottom-0 z-20 border-t border-[var(--line)] bg-[var(--bg)]/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          {COUNTED.has(step.kind) ? (
            <Counter key={step.id + index} target={target} onTarget={onTarget} onCount={() => undefined}
              onTargetChange={(x) => setTargets((m) => ({ ...m, [step.id]: x }))} />
          ) : <span />}
          <div className="flex flex-col gap-2">
            <Button onClick={next}>{last ? t('finish') : t('next')}</Button>
            {index > 0 && <Button variant="quiet" onClick={() => goTo(index - 1)}>{t('back')}</Button>}
          </div>
        </div>
      </footer>

      {leaving && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/40 p-3" onClick={() => setLeaving(false)}>
          <div role="dialog" aria-modal className="w-full max-w-md rounded-3xl bg-[var(--surface)] p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-extrabold">{t('leaveTitle')}</h2>
            <p className="mt-1 text-[var(--muted)]">{t('leaveText')}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setLeaving(false)}>{t('stay')}</Button>
              <Button className="flex-1" onClick={back}>{t('leave')}</Button>
            </div>
          </div>
        </div>
      )}
      {audioError && <Toast text={t('err_AUD01')} onClose={() => setAudioError(false)} />}
    </main>
  );
}
