'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { passwordStrength } from '@/lib/auth-utils';

const PW_LABELS = ['', 'Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
const PW_COLORS = ['', '#EF4444', '#F97316', '#EAB308', '#C8920A', '#22C55E'];

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', organization: '', password: '', confirmPassword: '',
  });
  const [showPw, setShowPw]     = useState(false);
  const [showCp, setShowCp]     = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: '' }));
  };

  const strength = passwordStrength(form.password);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim())   e.firstName = 'First name is required';
    if (!form.lastName.trim())    e.lastName  = 'Last name is required';
    if (!form.email.trim())       e.email     = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password)           e.password  = 'Password is required';
    else if (form.password.length < 8) e.password = 'At least 8 characters required';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      });
      const data = await res.json() as Record<string, any>;
      if (!data.ok) { setApiError(data.error); return; }
      router.push('/');
      router.refresh();
    } catch {
      setApiError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-bg-orb" style={{ top: -150, right: -150, width: 450, height: 450, background: 'radial-gradient(circle,rgba(200,146,10,.06) 0%,transparent 70%)' }} />
      <div className="auth-bg-orb" style={{ bottom: -100, left: -100, width: 400, height: 400, background: 'radial-gradient(circle,rgba(37,99,235,.05) 0%,transparent 70%)' }} />

      <div className="auth-card" style={{ maxWidth: 520 }}>
        <Link href="/login" className="auth-logo">
          <div className="nav-mark">
            <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5.5 9.5C6.5 11.5 9 13 9 13s2.5-1.5 3.5-3.5S12 5 9 5 4.5 7.5 5.5 9.5z" fill="currentColor" fillOpacity=".9" />
            </svg>
          </div>
          <span className="nav-name">Atlas</span>
        </Link>

        <div className="auth-eyebrow">GiveCentral · Create account</div>
        <h1 className="auth-h">Join <em>Atlas.</em></h1>
        <p className="auth-sub">Create your account to access the Atlas CRM preview.</p>

        {apiError && <div className="auth-err" role="alert">{apiError}</div>}

        <form onSubmit={submit} noValidate data-analytics-label="register-form">
          {/* Name row */}
          <div className="ff-row">
            <div className="ff-field">
              <label className="ff-label" htmlFor="r-fn">First name *</label>
              <input id="r-fn" className={`ff-input${errors.firstName ? ' error' : ''}`} type="text" placeholder="Jane" value={form.firstName} onChange={set('firstName')} autoComplete="given-name" />
              {errors.firstName && <span className="ff-err-msg" role="alert">{errors.firstName}</span>}
            </div>
            <div className="ff-field">
              <label className="ff-label" htmlFor="r-ln">Last name *</label>
              <input id="r-ln" className={`ff-input${errors.lastName ? ' error' : ''}`} type="text" placeholder="Smith" value={form.lastName} onChange={set('lastName')} autoComplete="family-name" />
              {errors.lastName && <span className="ff-err-msg" role="alert">{errors.lastName}</span>}
            </div>
          </div>

          <div className="ff-field">
            <label className="ff-label" htmlFor="r-email">Email address *</label>
            <input id="r-email" className={`ff-input${errors.email ? ' error' : ''}`} type="email" placeholder="you@diocese.org" value={form.email} onChange={set('email')} autoComplete="email" />
            {errors.email && <span className="ff-err-msg" role="alert">{errors.email}</span>}
          </div>

          <div className="ff-row">
            <div className="ff-field">
              <label className="ff-label" htmlFor="r-phone">Phone</label>
              <input id="r-phone" className="ff-input" type="tel" placeholder="+1 (312) 555-0100" value={form.phone} onChange={set('phone')} autoComplete="tel" />
            </div>
            <div className="ff-field">
              <label className="ff-label" htmlFor="r-org">Organization</label>
              <input id="r-org" className="ff-input" type="text" placeholder="Diocese of Chicago" value={form.organization} onChange={set('organization')} autoComplete="organization" />
            </div>
          </div>

          {/* Password */}
          <div className="ff-field">
            <label className="ff-label" htmlFor="r-pw">Password *</label>
            <div className="pw-wrap">
              <input
                id="r-pw"
                className={`ff-input${errors.password ? ' error' : ''}`}
                type={showPw ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={set('password')}
                autoComplete="new-password"
                style={{ paddingRight: 40 }}
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)} aria-label="Toggle password">
                <svg viewBox="0 0 16 16" fill="none" width="15" height="15"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>
              </button>
            </div>
            {/* Strength bar */}
            {form.password && (
              <>
                <div className="pw-bar-wrap" aria-hidden="true">
                  {[1,2,3,4,5].map(n => (
                    <div key={n} className="pw-bar" style={{ background: n <= strength ? PW_COLORS[strength] : undefined }} />
                  ))}
                </div>
                <div className="pw-hint">{PW_LABELS[strength]} — {strength < 3 ? 'Add uppercase, numbers, or symbols' : 'Good to go'}</div>
              </>
            )}
            {errors.password && <span className="ff-err-msg" role="alert">{errors.password}</span>}
          </div>

          {/* Confirm password */}
          <div className="ff-field">
            <label className="ff-label" htmlFor="r-cp">Confirm password *</label>
            <div className="pw-wrap">
              <input
                id="r-cp"
                className={`ff-input${errors.confirmPassword ? ' error' : ''}`}
                type={showCp ? 'text' : 'password'}
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                autoComplete="new-password"
                style={{ paddingRight: 40 }}
              />
              <button type="button" className="pw-toggle" onClick={() => setShowCp(v => !v)} aria-label="Toggle confirm password">
                <svg viewBox="0 0 16 16" fill="none" width="15" height="15"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>
              </button>
            </div>
            {errors.confirmPassword && <span className="ff-err-msg" role="alert">{errors.confirmPassword}</span>}
          </div>

          <button className="ff-submit" type="submit" disabled={loading} aria-busy={loading} data-analytics-cta="RegisterForm - Submit">
            {loading ? 'Creating account…' : 'Create account →'}
          </button>
        </form>

      </div>
    </div>
  );
}
