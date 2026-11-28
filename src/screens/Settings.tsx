import { Bell, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useApp } from '../state/app';
import { useNav } from '../state/nav';
import { LANG_NAMES } from '../i18n';
import type { Lang } from '../lib/dates';
import type { Meaning, Theme } from '../lib/db';
import { Card, Segmented } from '../components/ui';
import { passage } from '../content/quran';

const SAMPLE = passage('basmala').ayahs[0].ar.replace(/[\u00a0\s]*[\u0660-\u0669]+\s*$/, '');

export function SettingsScreen() {
  const { t, settings, update, dir } = useApp();
  const { go } = useNav();
  const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const langs = (Object.keys(LANG_NAMES) as Lang[]).map((l) => ({ value: l, text: LANG_NAMES[l] }));

  const field = (label: string, control: React.ReactNode) => (
    <div className="space-y-2">
      <p className="font-bold">{label}</p>
      {control}
    </div>
  );
  const link = (label: string, Icon: typeof Bell, onClick: () => void) => (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 text-start font-bold">
      <Icon className="text-[var(--accent)]" /><span className="flex-1">{label}</span><Chevron size={18} className="text-[var(--muted)]" />
    </button>
  );

  return (
    <main className="space-y-5 px-5 pb-28 pt-8">
      <h1 className="text-3xl font-black">{t('settingsTitle')}</h1>
      <Card className="space-y-5">
        {field(t('setLanguage'), <Segmented label={t('setLanguage')} value={settings.lang} options={langs}
          onChange={(lang) => update({ lang, meaning: lang === 'ar' ? settings.meaning : lang === 'en' && settings.meaning === 'am' ? 'en' : settings.meaning })} />)}
        {field(t('setMeaning'), <Segmented<Meaning> label={t('setMeaning')} value={settings.meaning} onChange={(meaning) => update({ meaning })}
          options={[{ value: 'am', text: LANG_NAMES.am }, { value: 'en', text: LANG_NAMES.en }, { value: 'none', text: t('off') }]} />)}
        {field(t('setAmPron'), (
          <div className="space-y-2">
            <Segmented label={t('setAmPron')} value={settings.amPron ? 'on' : 'off'} onChange={(v) => update({ amPron: v === 'on' })}
              options={[{ value: 'on', text: t('on') }, { value: 'off', text: t('off') }]} />
            <p className="text-xs leading-relaxed text-[var(--muted)]">{t('setAmPronHint')}</p>
          </div>
        ))}
        {field(t('setTranslit'), <Segmented label={t('setTranslit')} value={settings.translit ? 'on' : 'off'} onChange={(v) => update({ translit: v === 'on' })}
          options={[{ value: 'on', text: t('on') }, { value: 'off', text: t('off') }]} />)}
        {field(t('setFont'), (
          <div className="space-y-2">
            <Segmented<number> label={t('setFont')} value={settings.fontScale} onChange={(fontScale) => update({ fontScale })}
              options={[1, 1.15, 1.3, 1.5].map((v) => ({ value: v, text: `${Math.round(v * 100)}%` }))} />
            <p lang="ar" dir="rtl" className="quran text-center" style={{ fontSize: `${1.6 * settings.fontScale}rem` }}>{SAMPLE}</p>
          </div>
        ))}
        {field(t('setTheme'), <Segmented<Theme> label={t('setTheme')} value={settings.theme} onChange={(theme) => update({ theme })}
          options={[{ value: 'auto', text: t('themeAuto') }, { value: 'light', text: t('themeLight') }, { value: 'night', text: t('themeNight') }]} />)}
        {field(t('setAutoNext'), <Segmented label={t('setAutoNext')} value={settings.autoNext ? 'on' : 'off'} onChange={(v) => update({ autoNext: v === 'on' })}
          options={[{ value: 'on', text: t('on') }, { value: 'off', text: t('off') }]} />)}
      </Card>
      {link(t('setReminders'), Bell, () => go({ name: 'reminders' }))}
      {link(t('setAbout'), Info, () => go({ name: 'about' }))}
    </main>
  );
}
