'use client';

import { useEffect, useState } from 'react';

export default function Nav() {
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
          <img src="/atlas-logo.png" alt="Atlas" style={{ height: 50, width: 'auto' }} />
        </a>

        <div className="nav-right">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
          ))}
          <a href="#feedback" className="nav-cta">Become a founding partner</a>
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
        <a href="#feedback" className="nav-cta" onClick={() => setMenuOpen(false)}>Become a founding partner</a>
      </div>
    </>
  );
}
