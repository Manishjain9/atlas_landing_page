'use client';

import { useEffect, useRef } from 'react';

const STATS = [
  { val: <><span>22</span></>, lbl: 'Interactive screens' },
  { val: <><span>4</span>-tier</>, lbl: 'Diocese hierarchy' },
  { val: <>RE <span>→</span></>, lbl: 'Migration ready' },
  { val: <><span>3</span></>, lbl: 'Founding pilot clients' },
  { val: <><span>2026</span></>, lbl: 'Phase 1 launch' },
];

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('vis'); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stats-bar fu" ref={ref} role="region" aria-label="Key statistics">
      {STATS.map((s, i) => (
        <div className="stat-item" key={i}>
          <div className="stat-val">{s.val}</div>
          <div className="stat-lbl">{s.lbl}</div>
        </div>
      ))}
    </div>
  );
}
