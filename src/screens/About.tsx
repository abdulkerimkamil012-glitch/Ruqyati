import { useApp } from '../state/app';
import { Card, TopBar } from '../components/ui';

export const APP_VERSION = '1.0.0';

export function About() {
  const { t } = useApp();
  return (
    <main className="pb-28">
      <TopBar title={t('aboutTitle')} />
      <div className="space-y-4 px-5">
        <p className="leading-relaxed">{t('aboutText')}</p>
        <Card className="space-y-1 border-[var(--warm-ink)]/30 bg-[var(--warm)]">
          <h2 className="font-extrabold text-[var(--warm-ink)]">{t('aboutReview')}</h2>
          <p className="text-sm text-[var(--warm-ink)]">{t('aboutReviewPending')}</p>
        </Card>
        <Card className="space-y-2">
          <h2 className="font-extrabold">{t('aboutSources')}</h2>
          <ul className="list-disc space-y-1.5 ps-5 text-sm leading-relaxed text-[var(--muted)]">
            {(['aboutQuranText', 'aboutAmharic', 'aboutEnglish', 'aboutTranslit', 'aboutAudio', 'aboutDuas'] as const).map((k) => <li key={k}>{t(k)}</li>)}
          </ul>
        </Card>
        <p className="text-sm font-bold">{t('aboutMedicine')}</p>
        <p className="text-xs text-[var(--muted)]">{t('version', { v: APP_VERSION })}</p>
      </div>
    </main>
  );
}
