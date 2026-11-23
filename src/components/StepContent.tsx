import { Hand, HandHeart, Heart, Wind, Info } from 'lucide-react';
import type { Step } from '../content/types';
import { DUAS } from '../content/duas';
import { audioUrl, needsBasmala, passage } from '../content/quran';
import { useApp } from '../state/app';
import { AudioButton } from './AudioButton';
import { Badge } from './ui';

const stripNumber = (s: string) => s.replace(/[ \s]*[٠-٩]+\s*$/, '');

export function StepTitle({ step }: { step: Step }) {
  const { t, settings } = useApp();
  if (step.kind === 'passage') {
    const p = passage(step.ref!);
    const range = p.from === 1 && p.ayahs.length > 1 && p.surah !== 2 ? '' : ` ${p.surah}:${p.from}${p.to > p.from ? `–${p.to}` : ''}`;
    return <>{settings.lang === 'ar' ? `سورة ${p.nameAr}` : p.nameEn}<span className="font-semibold text-[var(--muted)]">{range}</span></>;
  }
  if (step.kind === 'dua') return <>{t(`dua_${step.ref}` as 'dua_istiadha')}</>;
  return <>{t(`step_${step.kind}` as 'step_note')}</>;
}

export function StepContent({ step, onAudioError }: { step: Step; onAudioError: () => void }) {
  const { t, settings } = useApp();
  const fs = settings.fontScale;
  const meaning = settings.meaning;
  const note = step.noteKey ? t(step.noteKey) : undefined;

  const action = (Icon: typeof Hand) => (
    <div className="flex flex-col items-center gap-5 py-6 text-center">
      <span className="grid size-24 place-items-center rounded-full bg-[var(--calm-soft)] text-[var(--calm)]"><Icon size={44} /></span>
      {note && <p className="max-w-prose text-lg leading-relaxed">{note}</p>}
    </div>
  );

  if (step.kind === 'intention') return action(Heart);
  if (step.kind === 'blowWipe') return action(Wind);
  if (step.kind === 'handOnHead') return action(HandHeart);
  if (step.kind === 'note') return action(Info);

  if (step.kind === 'dua') {
    const d = DUAS[step.ref!];
    return (
      <div className="space-y-4">
        {note && <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm text-[var(--muted)]"><Hand size={16} className="me-1 inline" />{note}</p>}
        <p lang="ar" dir="rtl" className="naskh text-center font-semibold" style={{ fontSize: `${1.7 * fs}rem` }}>{d.ar}</p>
        {settings.translit && <p className="text-center italic text-[var(--muted)]" dir="ltr">{d.tr}</p>}
        {meaning !== 'none' && <p className="text-center leading-relaxed">{d[meaning]}</p>}
        {d.adapted && <p className="text-center text-xs text-[var(--muted)]">{t('adaptedNote')}</p>}
      </div>
    );
  }

  const p = passage(step.ref!);
  const basmala = needsBasmala(p) ? stripNumber(passage('basmala').ayahs[0].ar) : undefined;
  return (
    <div className="space-y-4">
      {note && <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm text-[var(--muted)]">{note}</p>}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <AudioButton urls={p.ayahs.map(audioUrl)} onError={onAudioError} />
        <span className="text-xs text-[var(--muted)]">{t('audioHint')}</span>
      </div>
      <div lang="ar" dir="rtl" className="rounded-3xl bg-[var(--surface)] px-4 py-5 text-center shadow-[0_1px_0_var(--line)]">
        {basmala && <p className="quran mb-2 text-[var(--muted)]" style={{ fontSize: `${1.45 * fs}rem` }}>{basmala}</p>}
        <p className="quran" style={{ fontSize: `${1.75 * fs}rem` }}>
          {p.ayahs.map((a) => <span key={a.a}>{a.ar} </span>)}
        </p>
      </div>
      {(settings.translit || meaning !== 'none') && (
        <ol className="space-y-3">
          {p.ayahs.map((a) => (
            <li key={a.a} className="flex gap-3">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[var(--line)] text-xs font-bold tabular-nums">{a.a}</span>
              <span className="space-y-0.5">
                {settings.translit && <span className="block text-sm italic text-[var(--muted)]" dir="ltr">{a.tr}</span>}
                {meaning !== 'none' && <span className="block leading-relaxed">{a[meaning]}</span>}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function StepBadge({ step }: { step: Step }) {
  return <Badge label={step.label} source={step.source} />;
}
