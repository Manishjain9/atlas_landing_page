'use client';

import { useEffect, useState } from 'react';
import LogoutButton from './LogoutButton';
import type { SessionUser } from '@/lib/session';

interface NavProps {
  user?: SessionUser | null;
}

export default function Nav({ user }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 960) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navLinks = [
    { href: '#preview', label: 'Preview' },
    { href: '#roadmap', label: 'Roadmap' },
    { href: '#feedback', label: 'Feedback' },
  ];

  return (
    <>
      <nav className={`atlas-nav${scrolled ? ' scrolled' : ''}`} id="nav" aria-label="Main navigation">
        <a href="#home" className="nav-logo" aria-label="Atlas home">
          <div className="nav-mark">
            <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5.5 9.5C6.5 11.5 9 13 9 13s2.5-1.5 3.5-3.5S12 5 9 5 4.5 7.5 5.5 9.5z" fill="currentColor" fillOpacity=".9" />
            </svg>
          </div>
          <span className="nav-name">Atlas</span>
        </a>

        <div className="nav-right">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
          ))}
          {user ? (
            <div className="nav-user">
              <span className="nav-user-name">
                {user.firstName} {user.lastName}
              </span>
              <LogoutButton />
            </div>
          ) : (
            <a href="#feedback" className="nav-cta">Become a founding partner</a>
          )}
        </div>

        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        {navLinks.map((l) => (
          <a key={l.href} href={l.href} className="nav-link" onClick={() => setMenuOpen(false)}>{l.label}</a>
        ))}
        {user ? (
          <>
            <span className="nav-user-name">{user.firstName} {user.lastName}</span>
            <LogoutButton className="nav-cta" />
          </>
        ) : (
          <a href="#feedback" className="nav-cta" onClick={() => setMenuOpen(false)}>Become a founding partner</a>
        )}
      </div>
    </>
  );
}
