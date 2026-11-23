import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../state/app';
import { useNav } from '../state/nav';
import { ARTICLES } from '../content/articles';
import { ROUTINES } from '../content/routines';
import type { RoutineId } from '../content/types';

export function Library() {
  const { t, settings, dir } = useApp();
  const { go } = useNav();
  const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const row = (key: string, title: string, sub: string | undefined, onClick: () => void, tone: string) => (
    <li key={key}>
      <button onClick={onClick} className="flex w-full items-center gap-3 border-b border-[var(--line)] py-3.5 text-start">
        <span className={`h-8 w-1.5 shrink-0 rounded-full ${tone}`} aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block font-bold">{title}</span>
          {sub && <span className="block truncate text-sm text-[var(--muted)]">{sub}</span>}
        </span>
        <Chevron size={18} className="text-[var(--muted)]" />
      </button>
    </li>
  );
  const tone = (l: string) => (l === 'sunnah' ? 'bg-[var(--calm)]' : l === 'experience' ? 'bg-[var(--warm-ink)]' : 'bg-[var(--line)]');

  return (
    <main className="px-5 pb-28 pt-8">
      <h1 className="text-3xl font-black">{t('libraryTitle')}</h1>
      <h2 className="mt-6 text-sm font-extrabold text-[var(--muted)]">{t('libRoutines')}</h2>
      <ul>
        {(Object.keys(ROUTINES) as RoutineId[]).map((id) =>
          row(id, t(`routine_${id}`), t(`routine_${id}_desc`), () => go({ name: 'routine', id }), tone(ROUTINES[id].label)))}
      </ul>
      <h2 className="mt-8 text-sm font-extrabold text-[var(--muted)]">{t('libGuides')}</h2>
      <ul>
        {ARTICLES.map((a) => row(a.id, a.title[settings.lang], undefined, () => go({ name: 'article', id: a.id }), tone(a.label)))}
      </ul>
    </main>
  );
}
