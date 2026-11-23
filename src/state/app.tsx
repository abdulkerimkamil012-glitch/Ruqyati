import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_SETTINGS, db, newId, type Session, type Settings } from '../lib/db';
import { dayKey } from '../lib/dates';
import { errorKey, safe, type ErrorCode } from '../lib/errors';
import { DICTS, translate, type TFn } from '../i18n';
import type { RoutineId } from '../content/types';

interface AppCtx {
  ready: boolean;
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  t: TFn;
  dir: 'rtl' | 'ltr';
  sessions: Session[];
  doneDays: Set<string>;
  openSession: Session | undefined;
  start: (routineId: RoutineId) => Promise<Session>;
  saveStep: (s: Session, stepIndex: number) => void;
  complete: (s: Session) => void;
  error: ErrorCode | undefined;
  errorText: string | undefined;
  clearError: () => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState<ErrorCode>();

  useEffect(() => {
    (async () => {
      const s = await safe(() => db.settings.get('app'), undefined, setError);
      const list = await safe(() => db.sessions.toArray(), [] as Session[], setError);
      if (s) setSettings({ ...DEFAULT_SETTINGS, ...s });
      setSessions(list);
      setReady(true);
    })();
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void safe(() => db.settings.put(next), '', setError);
      return next;
    });
  }, []);

  const upsert = useCallback((s: Session) => {
    setSessions((prev) => [...prev.filter((x) => x.id !== s.id), s]);
    void safe(() => db.sessions.put(s), '', setError);
  }, []);

  const start = useCallback(async (routineId: RoutineId) => {
    const s: Session = { id: newId(), routineId, dayKey: dayKey(), startedAt: new Date().toISOString(), stepIndex: 0 };
    upsert(s);
    return s;
  }, [upsert]);

  const saveStep = useCallback((s: Session, stepIndex: number) => upsert({ ...s, stepIndex }), [upsert]);
  const complete = useCallback((s: Session) => upsert({ ...s, completedAt: new Date().toISOString() }), [upsert]);

  const value = useMemo<AppCtx>(() => {
    const today = dayKey();
    const doneDays = new Set(sessions.filter((s) => s.completedAt).map((s) => s.dayKey));
    const openSession = sessions
      .filter((s) => !s.completedAt && s.dayKey === today && s.stepIndex > 0)
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0];
    const t = translate(DICTS[settings.lang]);
    return {
      ready, settings, update, t, dir: settings.lang === 'ar' ? 'rtl' : 'ltr',
      sessions, doneDays, openSession, start, saveStep, complete,
      error, errorText: error ? t(errorKey(error)) : undefined, clearError: () => setError(undefined),
    };
  }, [ready, settings, update, sessions, start, saveStep, complete, error]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp outside AppProvider');
  return c;
}
