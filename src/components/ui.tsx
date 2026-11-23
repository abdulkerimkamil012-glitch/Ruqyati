import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react';
import type { Label } from '../content/types';
import { useApp } from '../state/app';
import { useNav } from '../state/nav';

export function Button({ variant = 'primary', className = '', ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'quiet' | 'outline' }) {
  const v = {
    primary: 'bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_6px_18px_-8px_var(--accent)] active:scale-[0.98]',
    quiet: 'bg-transparent text-[var(--accent)]',
    outline: 'border border-[var(--line)] bg-[var(--surface)] text-[var(--text)]',
  }[variant];
  return <button className={`min-h-12 rounded-2xl px-5 font-bold transition ${v} disabled:opacity-40 ${className}`} {...p} />;
}

export function TopBar({ title, right }: { title?: string; right?: ReactNode }) {
  const { back } = useNav();
  const { t, dir } = useApp();
  const Arrow = dir === 'rtl' ? ArrowRight : ArrowLeft;
  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 bg-[var(--bg)]/90 px-2 py-2 backdrop-blur">
      <button onClick={back} aria-label={t('back')} className="grid size-11 place-items-center rounded-full text-[var(--text)]">
        <Arrow size={22} />
      </button>
      <h1 className="flex-1 truncate text-lg font-extrabold">{title}</h1>
      {right}
    </header>
  );
}

const LABEL_STYLE: Record<Label, string> = {
  sunnah: 'bg-[var(--calm-soft)] text-[var(--calm)]',
  experience: 'bg-[var(--warm)] text-[var(--warm-ink)]',
  support: 'bg-[var(--line)] text-[var(--muted)]',
};
const LABEL_DOT: Record<Label, string> = { sunnah: '✅', experience: '🟡', support: '⚪' };

/** Evidence badge; tap to see what the label means. */
export function Badge({ label, source }: { label: Label; source?: string }) {
  const { t } = useApp();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-start gap-1">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${LABEL_STYLE[label]}`}>
        <span aria-hidden>{LABEL_DOT[label]}</span>{t(`label_${label}`)}
        {source && <span className="font-semibold opacity-80">· {source}</span>}
        <Info size={14} aria-hidden />
      </button>
      {open && <p className="max-w-prose text-sm text-[var(--muted)]">{t(`labelHelp_${label}`)}</p>}
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 ${className}`}>{children}</div>;
}

export function Segmented<T extends string | number>({ value, options, onChange, label }: {
  value: T; options: { value: T; text: string }[]; onChange: (v: T) => void; label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-2xl bg-[var(--line)]/60 p-1">
      {options.map((o) => (
        <button key={String(o.value)} role="radio" aria-checked={o.value === value} onClick={() => onChange(o.value)}
          className={`min-h-10 flex-1 rounded-xl px-2 text-sm font-bold transition ${o.value === value ? 'bg-[var(--surface)] text-[var(--accent)] shadow-sm' : 'text-[var(--muted)]'}`}>
          {o.text}
        </button>
      ))}
    </div>
  );
}

export function Toast({ text, onClose, action }: { text: string; onClose: () => void; action?: ReactNode }) {
  return (
    <div role="status" className="fixed inset-x-3 bottom-24 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-[var(--text)] px-4 py-3 text-[var(--bg)] shadow-xl">
      <p className="flex-1 text-sm">{text}</p>
      {action}
      <button onClick={onClose} className="text-sm font-bold opacity-80">✕</button>
    </div>
  );
}
