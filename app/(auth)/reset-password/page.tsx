'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { passwordStrength } from '@/lib/auth-utils';

const PW_LABELS = ['', 'Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
const PW_COLORS = ['', '#EF4444', '#F97316', '#EAB308', '#C8920A', '#22C55E'];

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token  = params.get('token') ?? '';

  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);
  const [loading, setLoading]       = useState(false);

  const strength = passwordStrength(password);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password)          { setError('Password is required'); return; }
    if (password.length < 8) { setError('At least 8 characters required'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (!token)             { setError('Invalid reset link'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword: confirm }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error); return; }
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2500);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
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

      {success ? (
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ fontSize: 36, marginBottom: 14 }}>✓</div>
          <h2 className="auth-h" style={{ textAlign: 'center' }}>Password <em>updated.</em></h2>
          <p className="auth-sub" style={{ textAlign: 'center' }}>Redirecting you to sign in…</p>
        </div>
      ) : (
        <>
          <div className="auth-eyebrow">GiveCentral · New password</div>
          <h1 className="auth-h">Choose a new <em>password.</em></h1>
          <p className="auth-sub">Must be at least 8 characters.</p>

          {!token && (
            <div className="auth-err">
              This reset link is invalid or has expired. <Link href="/forgot-password" style={{ color: 'var(--gold)' }}>Request a new one.</Link>
            </div>
          )}

          {error && <div className="auth-err" role="alert">{error}</div>}

          <form onSubmit={submit} noValidate>
            <div className="ff-field">
              <label className="ff-label" htmlFor="rp-pw">New password</label>
              <div className="pw-wrap">
                <input
                  id="rp-pw"
                  className="ff-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  style={{ paddingRight: 40 }}
                  disabled={!token}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)} aria-label="Toggle password">
                  <svg viewBox="0 0 16 16" fill="none" width="15" height="15"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>
                </button>
              </div>
              {password && (
                <>
                  <div className="pw-bar-wrap" aria-hidden="true">
                    {[1,2,3,4,5].map(n => (
                      <div key={n} className="pw-bar" style={{ background: n <= strength ? PW_COLORS[strength] : undefined }} />
                    ))}
                  </div>
                  <div className="pw-hint">{PW_LABELS[strength]}</div>
                </>
              )}
            </div>

            <div className="ff-field">
              <label className="ff-label" htmlFor="rp-cp">Confirm password</label>
              <input
                id="rp-cp"
                className="ff-input"
                type="password"
                placeholder="Repeat password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                autoComplete="new-password"
                disabled={!token}
              />
            </div>

            <button className="ff-submit" type="submit" disabled={loading || !token} aria-busy={loading}>
              {loading ? 'Updating…' : 'Update password →'}
            </button>
          </form>

          <div className="auth-foot">
            <Link href="/login">← Back to sign in</Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="auth-bg">
      <div className="auth-bg-orb" style={{ top: -150, right: -150, width: 450, height: 450, background: 'radial-gradient(circle,rgba(200,146,10,.06) 0%,transparent 70%)' }} />
      <Suspense fallback={null}>
        <ResetForm />
      </Suspense>
    </div>
  );
}
