import { ExternalLink } from 'lucide-react';
import { useApp } from '../state/app';
import { useNav } from '../state/nav';
import { ARTICLES } from '../content/articles';
import { DUAS } from '../content/duas';
import { DUA_AM_PRON } from '../content/duas-am';
import { ROUTINES } from '../content/routines';
import type { RoutineId } from '../content/types';
import { Badge, Button, TopBar } from '../components/ui';
import { StepBadge, StepContent, StepTitle } from '../components/StepContent';

export function ArticleScreen({ id }: { id: string }) {
  const { t, settings } = useApp();
  const a = ARTICLES.find((x) => x.id === id);
  if (!a) return null;
  const lang = settings.lang;
  return (
    <main className="pb-28">
      <TopBar title={a.title[lang]} />
      <article className="space-y-4 px-5">
        <Badge label={a.label} />
        <ul className="space-y-3">
          {a.body[lang].map((b, i) => (
            <li key={i} className="flex gap-3 leading-relaxed">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        {a.id === 'evilEye' && (
          <div className="rounded-3xl bg-[var(--surface)] p-4">
            <p lang="ar" dir="rtl" className="naskh text-center text-2xl font-semibold">{DUAS.mashaAllah.ar}</p>
            {settings.amPron && <p lang="am" className="mt-1 text-center text-lg font-semibold">{DUA_AM_PRON.mashaAllah.replaceAll('-', '\u2011')}</p>}
            {settings.translit && <p className="mt-1 text-center italic text-[var(--muted)]" dir="ltr">{DUAS.mashaAllah.tr}</p>}
          </div>
        )}
        {a.links && (
          <ul className="space-y-2">
            {a.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 font-bold text-[var(--accent)]">
                  <ExternalLink size={18} className="shrink-0" /><span>{l.title}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
        {a.sources.length > 0 && <p className="text-sm text-[var(--muted)]">{t('source')}: {a.sources.join(' · ')}</p>}
      </article>
    </main>
  );
}

export function RoutinePreview({ id }: { id: RoutineId }) {
  const { t, start } = useApp();
  const { go } = useNav();
  const r = ROUTINES[id];
  const begin = async () => {
    const s = await start(id);
    go({ name: 'session', sessionId: s.id, routineId: id });
  };
  return (
    <main className="pb-28">
      <TopBar title={t(`routine_${id}`)} />
      <div className="space-y-6 px-5">
        <p className="text-[var(--muted)]">{t(`routine_${id}_desc`)}</p>
        <Button className="w-full" onClick={begin}>{t('startThis')}</Button>
        <ol className="space-y-8">
          {r.steps.map((s, i) => (
            <li key={s.id + i} className="space-y-2">
              <h2 className="text-lg font-extrabold"><span className="me-2 tabular-nums text-[var(--muted)]">{i + 1}.</span><StepTitle step={s} />
                {(s.kind === 'passage' || s.kind === 'dua') && s.count !== 1 && <span className="ms-2 text-sm text-[var(--accent)]">{s.count === 'free' ? '' : `×${s.count}`}</span>}
              </h2>
              <StepBadge step={s} />
              <StepContent step={s} onAudioError={() => undefined} />
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
