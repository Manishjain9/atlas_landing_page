'use client';

import { useState, useCallback } from 'react';
import { CATEGORIES } from '@/lib/data';
import { driveThumb } from '@/lib/data';
import { Screen } from '@/types';
import FadeIn from './FadeIn';
import VideoModal from './VideoModal';

// ── Play button icon ──────────────────────────────────────────────────────────
function PlayIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      width="44"
      height="44"
      aria-hidden="true"
      style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.5))' }}
    >
      <circle cx="24" cy="24" r="23" fill="rgba(0,0,0,.55)" stroke="rgba(255,255,255,.35)" strokeWidth="1.5" />
      <path d="M19 15.5l16 8.5-16 8.5V15.5z" fill="white" />
    </svg>
  );
}

// ── Individual screen card ────────────────────────────────────────────────────
function ScreenCard({ screen, onOpen }: { screen: Screen; onOpen: (idx: number) => void }) {
  const [thumbFailed, setThumbFailed] = useState(false);
  const hasVideo = !!screen.videoId;
  const thumbUrl = hasVideo && !thumbFailed ? driveThumb(screen.videoId!) : null;

  return (
    <article
      className="mc"
      onClick={() => onOpen(screen.idx)}
      role="button"
      tabIndex={0}
      aria-label={hasVideo ? `Play video: ${screen.name}` : `Open preview: ${screen.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(screen.idx); }
      }}
    >
      {/* ── Preview area ── */}
      <div className="mc-prev" style={{ background: screen.colorBg, position: 'relative' }}>

        {/* Video thumbnail */}
        {thumbUrl && (
          <img
            src={thumbUrl}
            alt={`${screen.name} video thumbnail`}
            onError={() => setThumbFailed(true)}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              borderRadius: 0,
            }}
            loading="lazy"
          />
        )}

        {/* Fallback icon (no video OR thumb failed) */}
        {!thumbUrl && (
          <div
            className="mc-icon"
            style={{ background: `${screen.color}12`, border: `1px solid ${screen.color}30` }}
          >
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontStyle: 'italic', color: screen.color, lineHeight: 1, fontWeight: 500 }}>
                {screen.name.split(' ')[0]}
              </span>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 13, fontStyle: 'italic', color: screen.color, opacity: 0.7, lineHeight: 1.2, marginTop: 2 }}>
                {screen.name.split(' ').slice(1).join(' ')}
              </span>
            </span>
          </div>
        )}

        {/* Play button — always visible when video exists */}
        {hasVideo && (
          <div className="mc-play-btn" aria-hidden="true">
            <PlayIcon />
          </div>
        )}

        {/* Hover overlay */}
        <div className="mc-overlay">
          <div className="mc-launch">{hasVideo ? '▶ Play video' : '↗ Open preview'}</div>
        </div>
      </div>

      {/* ── Card info ── */}
      <div className="mc-info">
        <div className="mc-tag" style={{ color: screen.color }}>{screen.tag}</div>
        <div className="mc-name">{screen.name}</div>
        <div className="mc-desc">{screen.desc}</div>
        <span className={`ms ${screen.status === 'ready' ? 'ms-ready' : 'ms-soon'}`}>
          {screen.status === 'ready' ? '● Interactive' : '◦ Coming soon'}
        </span>
      </div>
    </article>
  );
}

// ── Gallery section ───────────────────────────────────────────────────────────
export default function PreviewGallery() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const openModal = useCallback((idx: number) => setActiveIdx(idx), []);
  const closeModal = useCallback(() => setActiveIdx(null), []);
  const navigate = useCallback((idx: number) => setActiveIdx(idx), []);

  return (
    <>
      <section
        className="atlas-section"
        id="preview"
        style={{ background: 'linear-gradient(to bottom,transparent,var(--ink2) 15%,var(--ink2) 85%,transparent)' }}
        aria-labelledby="preview-heading"
      >
        <div className="gallery-intro">
          <div>
            <FadeIn><div className="sec-ey">Live preview — 22 screens</div></FadeIn>
            <FadeIn delay={1}>
              <h2 className="sec-h" id="preview-heading">
                Click any screen<br /><em>to watch it live</em>
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={2}>
            <div>
              <p style={{ maxWidth: 280, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 12 }}>
                Each card plays a real walkthrough video. Click any tile — the video opens
                instantly and plays in full screen.
              </p>
              <div className="screen-count">
                <span>22</span> screens · <span style={{ fontFamily: 'inherit', fontSize: 'inherit' }}>20</span> videos
              </div>
            </div>
          </FadeIn>
        </div>

        <div id="gallery">
          {CATEGORIES.map((cat) => (
            <div className="cat-section" key={cat.label}>
              <div className="cat-label">
                <span className="cat-dot" style={{ background: cat.color }} aria-hidden="true" />
                {cat.label}
                <span className="cat-count">{cat.screens.length}</span>
              </div>
              <div className="cat-grid" role="list" aria-label={`${cat.label} screens`}>
                {cat.screens.map((screen) => (
                  <ScreenCard key={screen.idx} screen={screen} onOpen={openModal} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <VideoModal activeIdx={activeIdx} onClose={closeModal} onNavigate={navigate} />
    </>
  );
}
