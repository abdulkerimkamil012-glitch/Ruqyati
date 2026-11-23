import { BookOpen, Home, Settings, Sunrise } from 'lucide-react';
import { useApp } from '../state/app';
import { useNav, type Route } from '../state/nav';

const TABS = [
  { route: { name: 'home' } as Route, key: 'navHome', Icon: Home },
  { route: { name: 'library' } as Route, key: 'navLibrary', Icon: BookOpen },
  { route: { name: 'tracker' } as Route, key: 'navTracker', Icon: Sunrise },
  { route: { name: 'settings' } as Route, key: 'navSettings', Icon: Settings },
] as const;

export function BottomNav() {
  const { t } = useApp();
  const { route, tab } = useNav();
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur">
      <ul className="mx-auto flex max-w-lg">
        {TABS.map(({ route: r, key, Icon }) => {
          const active = route.name === r.name;
          return (
            <li key={key} className="flex-1">
              <button onClick={() => tab(r)} aria-current={active ? 'page' : undefined}
                className={`flex w-full flex-col items-center gap-0.5 py-2 text-xs font-bold ${active ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}>
                <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
                {t(key)}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
