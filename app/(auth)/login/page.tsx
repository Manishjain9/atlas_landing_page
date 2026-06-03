'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get('from') ?? '/';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Email is required'); return; }
    if (!password)     { setError('Password is required'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe: remember }),
      });
      const data = await res.json() as Record<string, any>;
      if (!data.ok) { setError(data.error); return; }
      router.push(from);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-eyebrow">GiveCentral · Secure access</div>
      <h1 className="auth-h">Welcome <em>back.</em></h1>
      <p className="auth-sub">Sign in to access the Atlas CRM preview.</p>

      {error && <div className="auth-err" role="alert">{error}</div>}

      <form onSubmit={submit} noValidate>
        <div className="ff-field">
          <label className="ff-label" htmlFor="login-email">Email address</label>
          <input id="login-email" className="ff-input" type="email" placeholder="you@diocese.org"
            value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" autoFocus />
        </div>

        <div className="ff-field">
          <label className="ff-label" htmlFor="login-pw">Password</label>
          <div className="pw-wrap">
            <input id="login-pw" className="ff-input" type={showPw ? 'text' : 'password'}
              placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="current-password" style={{ paddingRight: 40 }} />
            <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)} aria-label={showPw ? 'Hide' : 'Show'}>
              {showPw
                ? <svg viewBox="0 0 16 16" fill="none" width="15" height="15"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/><path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                : <svg viewBox="0 0 16 16" fill="none" width="15" height="15"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>
              }
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <label className="ff-check" style={{ marginBottom: 0 }}>
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
            Remember me for 30 days
          </label>
          <Link href="/forgot-password" className="auth-link-sm">Forgot password?</Link>
        </div>

        <button className="ff-submit" type="submit" disabled={loading} aria-busy={loading}>
          {loading ? 'Signing in…' : 'Sign in →'}
        </button>
      </form>

      <div className="auth-foot">
        Don&apos;t have an account?{' '}
        <Link href="/register">Create one</Link>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="auth-bg">
      <div className="auth-bg-orb" style={{ top: -180, left: -180, width: 500, height: 500, background: 'radial-gradient(circle,rgba(200,146,10,.07) 0%,transparent 70%)' }} />
      <div className="auth-bg-orb" style={{ bottom: -100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle,rgba(37,99,235,.05) 0%,transparent 70%)' }} />

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
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
