'use client';

import { useEffect, useState, useCallback } from 'react';
import { ALL_SCREENS } from '@/lib/data';
import { Screen } from '@/types';

interface LightboxProps {
  activeIdx: number | null;
  onClose: () => void;
  onNavigate: (idx: number) => void;
}

export default function Lightbox({ activeIdx, onClose, onNavigate }: LightboxProps) {
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const isOpen = activeIdx !== null;
  const screen: Screen | null = activeIdx !== null ? ALL_SCREENS[activeIdx] : null;

  const prev = useCallback(() => {
    if (activeIdx !== null && activeIdx > 0) onNavigate(activeIdx - 1);
  }, [activeIdx, onNavigate]);

  const next = useCallback(() => {
    if (activeIdx !== null && activeIdx < ALL_SCREENS.length - 1) onNavigate(activeIdx + 1);
  }, [activeIdx, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, prev, next]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleFlag = () => {
    if (activeIdx === null) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(activeIdx)) next.delete(activeIdx);
      else next.add(activeIdx);
      return next;
    });
  };

  if (!screen) return null;

  return (
    <div
      className={`lb${isOpen ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${screen.name}`}
    >
      {/* Backdrop */}
      <div className="lb-back" onClick={onClose} aria-hidden="true" />

      {/* Top bar */}
      <div className="lb-top">
        <button
          className="lb-nbtn"
          onClick={prev}
          disabled={activeIdx === 0}
          aria-label="Previous screen"
          title="Previous (←)"
          data-analytics-cta="Lightbox - Previous"
        >
          ←
        </button>
        <button
          className="lb-nbtn"
          onClick={next}
          disabled={activeIdx === ALL_SCREENS.length - 1}
          aria-label="Next screen"
          title="Next (→)"
          data-analytics-cta="Lightbox - Next"
        >
          →
        </button>
        <span className="lb-title">{screen.name}</span>
        <span className="lb-cat">{screen.tag}</span>
        <button className="lb-close" onClick={onClose} aria-label="Close preview (Esc)" data-analytics-cta="Lightbox - Close">✕</button>
      </div>

      {/* Frame */}
      <div className="lb-frame-wrap">
        <div className="lb-frame">
          <div className="lb-placeholder">
            <div
              className="lb-placeholder-icon"
              style={{ background: `${screen.color}18`, border: `1px solid ${screen.color}30` }}
            >
              <div className="lb-placeholder-icon-text" style={{ color: screen.color }}>
                {screen.name.split(' ').slice(0, 2).join('\n')}
              </div>
            </div>
            <h2 className="lb-placeholder-title">{screen.name}</h2>
            <p className="lb-placeholder-desc">{screen.desc}</p>
            <span className="lb-placeholder-note">
              Interactive prototype available to founding partners · Request access below
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="lb-foot">
        {/* Dot navigation */}
        <div className="lb-dots" aria-label="Screen navigation dots">
          {ALL_SCREENS.map((_, i) => (
            <button
              key={i}
              className={`lb-dot${i === activeIdx ? ' on' : ''}`}
              onClick={() => onNavigate(i)}
              aria-label={`Go to screen ${i + 1}: ${ALL_SCREENS[i].name}`}
              aria-current={i === activeIdx ? 'true' : undefined}
              data-analytics-cta={`Lightbox - Navigate ${ALL_SCREENS[i].name}`}
            />
          ))}
        </div>

        <span className="lb-hint">← → to navigate · Esc to close</span>

        {/* Quick actions */}
        <div className="lb-qf">
          <button
            className={`lbf${activeIdx !== null && flagged.has(activeIdx) ? ' on' : ''}`}
            onClick={toggleFlag}
            aria-pressed={activeIdx !== null && flagged.has(activeIdx)}
            data-analytics-cta="Lightbox - Note Screen"
          >
            {activeIdx !== null && flagged.has(activeIdx) ? '✓ Noted' : '+ Note this screen'}
          </button>
          <a href="#feedback" className="lbf" onClick={onClose} data-analytics-cta="Lightbox - Request Access">
            Request access →
          </a>
        </div>
      </div>
    </div>
  );
}
