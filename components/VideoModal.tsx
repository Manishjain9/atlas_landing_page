'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { ALL_SCREENS } from '@/lib/data';
import { driveEmbed } from '@/lib/data';

interface VideoModalProps {
  activeIdx: number | null;
  onClose: () => void;
  onNavigate: (idx: number) => void;
}

export default function VideoModal({ activeIdx, onClose, onNavigate }: VideoModalProps) {
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isOpen = activeIdx !== null;
  const screen = activeIdx !== null ? ALL_SCREENS[activeIdx] : null;

  const prev = useCallback(() => {
    if (activeIdx !== null && activeIdx > 0) onNavigate(activeIdx - 1);
  }, [activeIdx, onNavigate]);

  const next = useCallback(() => {
    if (activeIdx !== null && activeIdx < ALL_SCREENS.length - 1) onNavigate(activeIdx + 1);
  }, [activeIdx, onNavigate]);

  // Keyboard: Esc / ← / →
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

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Reset loading state whenever the screen changes
  useEffect(() => { setLoading(true); }, [activeIdx]);

  if (!screen) return null;

  const embedUrl = screen.videoId ? driveEmbed(screen.videoId) : null;

  return (
    <div
      className={`vm${isOpen ? ' vm-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={screen.videoId ? `Video: ${screen.name}` : `Preview: ${screen.name}`}
    >
      {/* Backdrop */}
      <div className="vm-back" onClick={onClose} aria-hidden="true" />

      {/* Top bar */}
      <div className="vm-top">
        <button className="vm-nbtn" onClick={prev} disabled={activeIdx === 0} aria-label="Previous" title="← Previous">
          ←
        </button>
        <button className="vm-nbtn" onClick={next} disabled={activeIdx === ALL_SCREENS.length - 1} aria-label="Next" title="→ Next">
          →
        </button>

        <div className="vm-title-wrap">
          <span className="vm-title">{screen.name}</span>
          <span className="vm-cat" style={{ color: screen.color }}>{screen.tag}</span>
        </div>

        <span className="vm-counter">{(activeIdx ?? 0) + 1} / {ALL_SCREENS.length}</span>
        <button className="vm-close" onClick={onClose} aria-label="Close (Esc)">✕</button>
      </div>

      {/* Video frame */}
      <div className="vm-body">
        {embedUrl ? (
          <div className="vm-frame-wrap">
            {/* Loading spinner */}
            {loading && (
              <div className="vm-loading" aria-live="polite" aria-label="Loading video…">
                <div className="vm-spinner" />
                <span>Loading video…</span>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={embedUrl}
              className="vm-iframe"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={`${screen.name} walkthrough video`}
              onLoad={() => setLoading(false)}
              style={{ opacity: loading ? 0 : 1, transition: 'opacity .3s' }}
            />
          </div>
        ) : (
          /* Fallback — no video for this screen */
          <div className="vm-no-video">
            <div className="vm-no-video-icon" style={{ background: `${screen.color}18`, border: `1px solid ${screen.color}30` }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontStyle: 'italic', color: screen.color, lineHeight: 1.1, textAlign: 'center', display: 'block' }}>
                {screen.name.split(' ').slice(0, 2).join('\n')}
              </span>
            </div>
            <p className="vm-no-video-title">{screen.name}</p>
            <p className="vm-no-video-desc">{screen.desc}</p>
            <span className="vm-no-video-note">Video walkthrough coming soon for this screen.</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="vm-foot">
        {/* Dot strip */}
        <div className="vm-dots" aria-label="Screen navigation">
          {ALL_SCREENS.map((s, i) => (
            <button
              key={i}
              className={`vm-dot${i === activeIdx ? ' on' : ''}${s.videoId ? ' has-video' : ''}`}
              onClick={() => onNavigate(i)}
              aria-label={`${s.name}${s.videoId ? ' (video)' : ''}`}
              title={s.name}
            />
          ))}
        </div>
        <span className="vm-hint">← → to navigate · Esc to close</span>
      </div>
    </div>
  );
}
