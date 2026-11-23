import { useApp } from '../state/app';
import { useNav } from '../state/nav';
import { Button } from '../components/ui';
import { Horizon } from '../components/Horizon';
import { dayKey } from '../lib/dates';
import { doneInLast30 } from '../lib/streak';

export function Complete() {
  const { t, doneDays } = useApp();
  const { tab } = useNav();
  const today = dayKey();
  return (
    <main className="sky flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Horizon done={doneDays} today={today} count={doneInLast30(doneDays, today)} label={t('last30Label')} />
      <div className="rise space-y-2">
        <h1 className="text-2xl font-black">{t('completeTitle')}</h1>
        <p className="mx-auto max-w-xs text-lg text-[var(--muted)]">{t('completeText')}</p>
      </div>
      <Button className="w-full max-w-xs" onClick={() => tab({ name: 'home' })}>{t('completeHome')}</Button>
    </main>
  );
}
