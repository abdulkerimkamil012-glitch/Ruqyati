import { CheckCircle2, ChevronRight, ChevronLeft, Flame, HandHeart, Hand, Sparkles, Moon } from 'lucide-react';
import { useApp } from '../state/app';
import { useNav } from '../state/nav';
import { Button } from '../components/ui';
import { Horizon } from '../components/Horizon';
import { ROUTINES } from '../content/routines';
import type { RoutineId } from '../content/types';
import { dayKey } from '../lib/dates';
import { doneInLast30, streak } from '../lib/streak';

const ROUTINE_ICON: Record<RoutineId, typeof Sparkles> = { sunnah: Sparkles, extended: Moon, other: HandHeart, pain: Hand };

export function Home() {
  const { t, doneDays, openSession, start, dir } = useApp();
  const { go } = useNav();
  const today = dayKey();
  const isDone = doneDays.has(today);
  const st = streak(doneDays, today);
  const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight;

  const begin = async (id: RoutineId) => {
    const s = await start(id);
    go({ name: 'session', sessionId: s.id, routineId: id });
  };

  return (
    <main className="pb-28">
      <section className="sky px-5 pb-6 pt-8">
        <p className="text-sm font-bold text-[var(--muted)]">{t('greeting')}</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">{t('appName')}</h1>
        <div className="mt-4">
          <Horizon done={doneDays} today={today} count={doneInLast30(doneDays, today)} label={t('last30Label')} />
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm font-bold">
          {isDone
            ? <span className="flex items-center gap-1.5 text-[var(--calm)]"><CheckCircle2 size={18} />{t('todayDone')}</span>
            : <span className="text-[var(--muted)]">{t('todayNotYet')}</span>}
        </div>
        {st.days > 1 && (
          <p className="mt-1 flex items-center justify-center gap-1 text-sm font-bold text-[var(--warm-ink)]">
            <Flame size={16} />{t('streakDays', { n: st.days })}
          </p>
        )}
      </section>

      <section className="space-y-3 px-5">
        {openSession && (
          <button onClick={() => go({ name: 'session', sessionId: openSession.id, routineId: openSession.routineId })}
            className="flex w-full items-center gap-3 rounded-3xl border-2 border-[var(--accent)] bg-[var(--surface)] p-4 text-start">
            <span className="flex-1">
              <span className="block font-extrabold">{t('resume')}</span>
              <span className="text-sm text-[var(--muted)]">{t(`routine_${openSession.routineId}`)} · {t('resumeStep', { n: openSession.stepIndex + 1, total: ROUTINES[openSession.routineId].steps.length })}</span>
            </span>
            <Chevron className="text-[var(--accent)]" />
          </button>
        )}
        <Button className="w-full text-lg" onClick={() => begin('sunnah')}>{t('startRuqyah')}</Button>
        <h2 className="pt-4 text-sm font-extrabold text-[var(--muted)]">{t('chooseTitle')}</h2>
        <ul className="space-y-2">
          {(Object.keys(ROUTINES) as RoutineId[]).map((id) => {
            const Icon = ROUTINE_ICON[id];
            const r = ROUTINES[id];
            return (
              <li key={id}>
                <button onClick={() => begin(id)} className="flex w-full items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 text-start">
                  <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${r.label === 'experience' ? 'bg-[var(--warm)] text-[var(--warm-ink)]' : 'bg-[var(--calm-soft)] text-[var(--calm)]'}`}>
                    <Icon size={22} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-extrabold">{t(`routine_${id}`)}</span>
                    <span className="block text-sm text-[var(--muted)]">{t(`routine_${id}_desc`)}</span>
                  </span>
                  <Chevron size={18} className="shrink-0 text-[var(--muted)]" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
