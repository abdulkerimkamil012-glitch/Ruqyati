import { useState } from 'react';
import { CalendarPlus, Download } from 'lucide-react';
import { useApp } from '../state/app';
import { buildIcs, googleCalendarUrl, isValidTime } from '../lib/reminder';
import { Button, Card, Segmented, Toast, TopBar } from '../components/ui';

export function Reminders() {
  const { t, settings, update } = useApp();
  const [time, setTime] = useState(settings.reminderTime);
  const [saved, setSaved] = useState(false);
  const valid = isValidTime(time);

  const input = () => {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    return { time, title: t('reminderTitleText'), details: t('reminderDetails'), url: location.origin, start };
  };
  const remember = () => valid && update({ reminderTime: time });

  const downloadIcs = () => {
    remember();
    const blob = new Blob([buildIcs(input())], { type: 'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ruqyati-reminder.ics';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    setSaved(true);
  };

  return (
    <main className="pb-28">
      <TopBar title={t('remindersTitle')} />
      <div className="space-y-5 px-5">
        <p className="text-[var(--muted)]">{t('remindersIntro')}</p>
        <Card className="space-y-3">
          <Segmented label={t('reminderTime')} value={time === '06:30' ? 'm' : time === '20:30' ? 'e' : 'c'}
            onChange={(v) => v !== 'c' && setTime(v === 'm' ? '06:30' : '20:30')}
            options={[{ value: 'm', text: t('reminderMorning') }, { value: 'e', text: t('reminderEvening') }]} />
          <label className="flex items-center justify-between gap-3 font-bold">
            {t('reminderTime')}
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
              className="min-h-11 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 text-lg tabular-nums" dir="ltr" />
          </label>
        </Card>
        <a href={valid ? googleCalendarUrl(input()) : undefined} target="_blank" rel="noreferrer" onClick={remember}
          className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 font-bold text-[var(--accent-ink)] ${valid ? '' : 'pointer-events-none opacity-40'}`}>
          <CalendarPlus size={20} />{t('addGoogle')}
        </a>
        <Button variant="outline" className="flex w-full items-center justify-center gap-2" disabled={!valid} onClick={downloadIcs}>
          <Download size={20} />{t('addOther')}
        </Button>
      </div>
      {saved && <Toast text={t('reminderSaved')} onClose={() => setSaved(false)} />}
    </main>
  );
}
