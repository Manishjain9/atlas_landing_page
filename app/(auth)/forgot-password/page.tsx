'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('');
  const [error, setError]   = useState('');
  const [sent, setSent]     = useState(false);
  const [devUrl, setDevUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Email is required'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error); return; }
      setSent(true);
      if (data._devResetUrl) setDevUrl(data._devResetUrl);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-bg-orb" style={{ top: -150, left: '30%', width: 400, height: 400, background: 'radial-gradient(circle,rgba(200,146,10,.06) 0%,transparent 70%)' }} />

      <div className="auth-card">
        <Link href="/login" className="auth-logo">
          <div className="nav-mark">
            <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5.5 9.5C6.5 11.5 9 13 9 13s2.5-1.5 3.5-3.5S12 5 9 5 4.5 7.5 5.5 9.5z" fill="currentColor" fillOpacity=".9" />
            </svg>
          </div>
          <span className="nav-name">Atlas</span>
        </Link>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>✉️</div>
            <h2 className="auth-h" style={{ textAlign: 'center' }}>Check your <em>email.</em></h2>
            <p className="auth-sub" style={{ textAlign: 'center', maxWidth: 320, margin: '0 auto 20px' }}>
              If an account exists for <strong style={{ color: 'white' }}>{email}</strong>, we&apos;ve sent a password reset link. Check your inbox.
            </p>
            {/* Dev-only reset link */}
            {devUrl && (
              <div style={{ background: 'rgba(200,146,10,.08)', border: '1px solid rgba(200,146,10,.22)', borderRadius: 8, padding: '12px 14px', marginBottom: 20, textAlign: 'left' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>
                  Dev mode — reset link
                </div>
                <a href={devUrl} style={{ fontSize: 11, color: 'var(--golda)', wordBreak: 'break-all' }}>{devUrl}</a>
              </div>
            )}
            <Link href="/login" className="ff-submit" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 0 }}>
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="auth-eyebrow">GiveCentral · Password recovery</div>
            <h1 className="auth-h">Reset your <em>password.</em></h1>
            <p className="auth-sub">Enter your email and we&apos;ll send you a reset link.</p>

            {error && <div className="auth-err" role="alert">{error}</div>}

            <form onSubmit={submit} noValidate>
              <div className="ff-field">
                <label className="ff-label" htmlFor="fp-email">Email address</label>
                <input
                  id="fp-email"
                  className="ff-input"
                  type="email"
                  placeholder="you@diocese.org"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
              </div>
              <button className="ff-submit" type="submit" disabled={loading} aria-busy={loading}>
                {loading ? 'Sending…' : 'Send reset link →'}
              </button>
            </form>

            <div className="auth-foot">
              <Link href="/login">← Back to sign in</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
