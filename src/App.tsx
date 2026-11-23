import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useApp } from './state/app';
import { useNav } from './state/nav';
import { BottomNav } from './components/BottomNav';
import { Button, Toast } from './components/ui';
import { Home } from './screens/Home';
import { Session } from './screens/Session';
import { Complete } from './screens/Complete';
import { Library } from './screens/Library';
import { ArticleScreen, RoutinePreview } from './screens/Article';
import { Tracker } from './screens/Tracker';
import { Reminders } from './screens/Reminders';
import { SettingsScreen } from './screens/Settings';
import { About } from './screens/About';
import { Welcome } from './screens/Welcome';

function useTheme(theme: 'auto' | 'light' | 'night') {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const night = theme === 'night' || (theme === 'auto' && mq.matches);
      document.documentElement.dataset.theme = night ? 'night' : 'light';
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', night ? '#0d1a25' : '#3A8FC0');
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);
}

function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return online;
}

export function App() {
  const { ready, settings, t, dir, errorText, clearError } = useApp();
  const { route } = useNav();
  const online = useOnline();
  const [offlineSeen, setOfflineSeen] = useState(false);
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW();
  useTheme(settings.theme);

  useEffect(() => {
    document.documentElement.lang = settings.lang;
    document.documentElement.dir = dir;
  }, [settings.lang, dir]);

  if (!ready) return <div className="min-h-dvh" aria-busy />;
  if (!settings.onboarded) return <Welcome />;

  const tabs = ['home', 'library', 'tracker', 'settings'].includes(route.name);
  return (
    <div className="mx-auto min-h-dvh max-w-lg">
      {route.name === 'home' && <Home />}
      {route.name === 'session' && <Session key={route.sessionId} sessionId={route.sessionId} routineId={route.routineId} />}
      {route.name === 'complete' && <Complete />}
      {route.name === 'library' && <Library />}
      {route.name === 'article' && <ArticleScreen id={route.id} />}
      {route.name === 'routine' && <RoutinePreview id={route.id} />}
      {route.name === 'tracker' && <Tracker />}
      {route.name === 'reminders' && <Reminders />}
      {route.name === 'settings' && <SettingsScreen />}
      {route.name === 'about' && <About />}
      {tabs && <BottomNav />}
      {!online && !offlineSeen && <Toast text={t('offline')} onClose={() => setOfflineSeen(true)} />}
      {errorText && <Toast text={errorText} onClose={clearError} />}
      {needRefresh && (
        <Toast text={t('updateReady')} onClose={() => setNeedRefresh(false)}
          action={<Button className="min-h-9 px-3 text-sm" onClick={() => updateServiceWorker(true)}>{t('update')}</Button>} />
      )}
    </div>
  );
}
