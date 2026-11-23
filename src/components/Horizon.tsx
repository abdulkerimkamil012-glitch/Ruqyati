import { addDays } from '../lib/dates';

/**
 * Signature element: 30 days drawn as points on a dawn arc.
 * The sun rises along the arc with each day of ruqyah in the last 30 days.
 */
export function Horizon({ done, today, count, label }: { done: Set<string>; today: string; count: number; label: string }) {
  const W = 320, H = 150, cx = W / 2, cy = 150, r = 130;
  const pt = (i: number) => {
    const a = Math.PI - (i / 29) * Math.PI; // left → right
    return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
  };
  const sun = pt(Math.max(0, Math.min(29, count - 1)));
  const days = Array.from({ length: 30 }, (_, i) => addDays(today, i - 29));
  return (
    <figure className="relative mx-auto w-full max-w-sm" aria-label={label}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-hidden>
        <defs>
          <radialGradient id="sunGlow">
            <stop offset="0%" stopColor="#ffe7a8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffe7a8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="var(--line)" strokeWidth="2" strokeDasharray="2 6" />
        {days.map((d, i) => {
          const p = pt(i);
          const isDone = done.has(d);
          return <circle key={d} cx={p.x} cy={p.y} r={isDone ? 4.5 : 3} fill={isDone ? 'var(--accent)' : 'var(--line)'} />;
        })}
        {count > 0 && (
          <g className="rise">
            <circle cx={sun.x} cy={sun.y} r="26" fill="url(#sunGlow)" />
            <circle cx={sun.x} cy={sun.y} r="11" fill="#f6c453" stroke="#fff3cf" strokeWidth="3" />
          </g>
        )}
        <line x1="0" y1={cy - 1} x2={W} y2={cy - 1} stroke="var(--calm)" strokeWidth="2" opacity="0.5" />
      </svg>
      <figcaption className="absolute inset-x-0 bottom-3 text-center">
        <span className="block text-4xl font-black tabular-nums text-[var(--text)]">{count}<span className="text-xl text-[var(--muted)]">/30</span></span>
        <span className="text-sm font-semibold text-[var(--muted)]">{label}</span>
      </figcaption>
    </figure>
  );
}
