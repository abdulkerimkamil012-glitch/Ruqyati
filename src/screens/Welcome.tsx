import { useState } from 'react';
import { BookCheck, HandHeart, Sparkles, Wind } from 'lucide-react';
import { useApp } from '../state/app';
import { LANG_NAMES } from '../i18n';
import type { Lang } from '../lib/dates';
import { Button } from '../components/ui';

export function Welcome() {
  const { t, update, settings } = useApp();
  const [page, setPage] = useState(0);
  const pick = (lang: Lang) => update({ lang, meaning: lang === 'en' ? 'en' : 'am' });

  return (
    <main className="sky flex min-h-dvh flex-col px-6 pb-8 pt-12">
      <div className="flex justify-center gap-1.5" aria-hidden>
        {[0, 1, 2].map((i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i === page ? 'w-8 bg-[var(--accent)]' : 'w-3 bg-[var(--line)]'}`} />)}
      </div>

      <section key={page} className="rise flex flex-1 flex-col justify-center gap-6">
        {page === 0 && (
          <>
            <div className="text-center">
              <p lang="ar" className="naskh text-5xl font-bold text-[var(--accent)]">رُقْيَتِي</p>
              <h1 className="mt-2 text-3xl font-black">{t('appName')}</h1>
              <p className="mt-2 text-[var(--muted)]">{t('tagline')}</p>
            </div>
            <div className="space-y-2">
              <p className="text-center font-bold">{t('welcomeLang')}</p>
              {(Object.keys(LANG_NAMES) as Lang[]).map((l) => (
                <button key={l} onClick={() => pick(l)} aria-pressed={settings.lang === l}
                  className={`w-full rounded-2xl border-2 p-4 text-xl font-bold ${settings.lang === l ? 'border-[var(--accent)] bg-[var(--surface)]' : 'border-transparent bg-[var(--surface)]/60'}`}>
                  {LANG_NAMES[l]}
                </button>
              ))}
            </div>
          </>
        )}
        {page === 1 && (
          <>
            <h1 className="text-3xl font-black">{t('welcomeHowTitle')}</h1>
            <ol className="space-y-5">
              {([[Sparkles, 'welcomeHow1'], [BookCheck, 'welcomeHow2'], [Wind, 'welcomeHow3']] as const).map(([Icon, k], i) => (
                <li key={k} className="flex gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--surface)] font-black text-[var(--accent)]">{i + 1}</span>
                  <span className="pt-1 text-lg leading-relaxed"><Icon size={18} className="me-1 inline text-[var(--calm)]" />{t(k)}</span>
                </li>
              ))}
            </ol>
          </>
        )}
        {page === 2 && (
          <>
            <span className="mx-auto grid size-24 place-items-center rounded-full bg-[var(--calm-soft)] text-[var(--calm)]"><HandHeart size={48} /></span>
            <h1 className="text-center text-3xl font-black">{t('welcomeTrustTitle')}</h1>
            <p className="text-center text-lg leading-relaxed">{t('welcomeTrust')}</p>
            <p className="text-center text-[var(--muted)]">{t('welcomeSources')}</p>
          </>
        )}
      </section>

      <div className="flex gap-2">
        {page > 0 && <Button variant="outline" onClick={() => setPage(page - 1)}>{t('back')}</Button>}
        <Button className="flex-1" onClick={() => (page < 2 ? setPage(page + 1) : update({ onboarded: true }))}>
          {page < 2 ? t('continue') : t('welcomeStart')}
        </Button>
      </div>
    </main>
  );
}
