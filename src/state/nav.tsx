import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { RoutineId } from '../content/types';

export type Route =
  | { name: 'home' }
  | { name: 'session'; sessionId: string; routineId: RoutineId }
  | { name: 'complete' }
  | { name: 'library' }
  | { name: 'article'; id: string }
  | { name: 'routine'; id: RoutineId }
  | { name: 'tracker' }
  | { name: 'settings' }
  | { name: 'reminders' }
  | { name: 'about' };

interface NavCtx {
  route: Route;
  go: (r: Route) => void;
  replace: (r: Route) => void;
  back: () => void;
  tab: (r: Route) => void;
}

const Ctx = createContext<NavCtx | null>(null);

/** Small screen stack that works with the phone's back button. */
export function NavProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }]);

  useEffect(() => {
    const onPop = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stack]);

  const go = useCallback((r: Route) => {
    history.pushState(null, '');
    setStack((s) => [...s, r]);
  }, []);
  const replace = useCallback((r: Route) => setStack((s) => [...s.slice(0, -1), r]), []);
  const back = useCallback(() => history.back(), []);
  const tab = useCallback((r: Route) => {
    setStack((s) => {
      if (s.length > 1) history.go(-(s.length - 1));
      return [r];
    });
  }, []);

  return <Ctx.Provider value={{ route: stack[stack.length - 1], go, replace, back, tab }}>{children}</Ctx.Provider>;
}

export function useNav(): NavCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useNav outside NavProvider');
  return c;
}
