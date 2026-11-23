import { Bell, Flame } from 'lucide-react';
import { useApp } from '../state/app';
import { useNav } from '../state/nav';
import { addDays, dayKey, formatEthiopian, formatGregorian } from '../lib/dates';
import { doneInLast30, streak } from '../lib/streak';
import { Card } from '../components/ui';
import { Horizon } from '../components/Horizon';

export function Tracker() {
  const { t, doneDays, settings } = useApp();
  const { go } = useNav();
  const today = dayKey();
  const st = streak(doneDays, today);
  const last30 = doneInLast30(doneDays, today);
  const days = Array.from({ length: 30 }, (_, i) => addDays(today, -i));
  const lang = settings.lang;

  return (
    <main className="pb-28">
      <section className="sky px-5 pb-4 pt-8">
        <h1 className="text-3xl font-black">{t('trackerTitle')}</h1>
        <p className="mt-2 max-w-prose text-[var(--muted)]">{t('trackerIntro')}</p>
        <div className="mt-4"><Horizon done={doneDays} today={today} count={last30} label={t('last30Label')} /></div>
      </section>
      <div className="space-y-4 px-5">
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <Flame className="mx-auto text-[var(--warm-ink)]" />
            <p className="text-3xl font-black tabular-nums">{st.days}</p>
            <p className="text-sm font-bold text-[var(--muted)]">{t('streakLabel')}</p>
          </Card>
          <Card className="text-center">
            <p className="pt-6 text-3xl font-black tabular-nums">{doneDays.size}</p>
            <p className="text-sm font-bold text-[var(--muted)]">{t('totalLabel')}</p>
          </Card>
        </div>
        <p className="text-sm text-[var(--muted)]">{t('restDayNote')}</p>
        <button onClick={() => go({ name: 'reminders' })} className="flex w-full items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 text-start font-bold">
          <Bell className="text-[var(--accent)]" />{t('remindersTitle')}
        </button>
        {doneDays.size === 0 ? <p className="py-6 text-center text-[var(--muted)]">{t('noHistory')}</p> : (
          <ul className="grid grid-cols-5 gap-2" aria-label={t('last30Label')}>
            {days.map((d) => {
              const done = doneDays.has(d);
              return (
                <li key={d} title={done ? t('dayDone') : t('dayMissed')}
                  className={`flex aspect-square flex-col items-center justify-center rounded-2xl text-center ${done ? 'bg-[var(--accent)] text-[var(--accent-ink)]' : 'bg-[var(--surface)] text-[var(--muted)]'} ${d === today ? 'ring-2 ring-[var(--calm)]' : ''}`}>
                  <span className="text-[0.7rem] font-extrabold leading-tight">{formatEthiopian(d, lang, { day: 'numeric', month: 'short' })}</span>
                  <span className="text-[0.6rem] leading-tight opacity-80">{formatGregorian(d, lang)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
