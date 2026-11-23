import { useEffect, useRef, useState } from 'react';
import { Pause, Volume2 } from 'lucide-react';
import { useApp } from '../state/app';

/** Plays a list of verse files one after another. */
export function AudioButton({ urls, onError }: { urls: string[]; onError: () => void }) {
  const { t } = useApp();
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const index = useRef(0);

  const stop = () => {
    audio.current?.pause();
    audio.current = null;
    setPlaying(false);
  };

  useEffect(() => stop, [urls.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps

  const playAt = (i: number) => {
    if (i >= urls.length) return stop();
    index.current = i;
    const a = new Audio(urls[i]);
    audio.current = a;
    a.onended = () => audio.current === a && playAt(i + 1);
    a.onerror = () => {
      if (audio.current !== a) return;
      stop();
      onError();
    };
    a.play().catch(() => {
      if (audio.current !== a) return;
      stop();
      onError();
    });
  };

  return (
    <button onClick={() => (playing ? stop() : (setPlaying(true), playAt(0)))} aria-pressed={playing}
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 text-sm font-bold text-[var(--accent)]">
      {playing ? <Pause size={18} /> : <Volume2 size={18} />}
      {playing ? t('stop') : t('play')}
    </button>
  );
}
