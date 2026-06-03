'use client';

import { useState, FormEvent } from 'react';

const TOP_FEATURES = [
  'Diocese & parish hierarchy',
  'GiveCentral payment integration',
  'Major gifts pipeline',
  'Pledge & CMA management',
  'Guru AI natural language queries',
  'Address hygiene & data health',
  'Parish access controls',
  'Reporting & analytics',
];

const INTEREST_AREAS = [
  'Joining as a founding partner',
  'Beta testing when available',
  'Following product updates',
  'Providing ongoing use-case feedback',
];

interface FormState {
  diocese: string;
  nameRole: string;
  email: string;
  rating: number;
  topFeature: string;
  changeOrAdd: string;
  interests: string[];
}

interface FormErrors {
  diocese?: string;
  nameRole?: string;
  email?: string;
}

function validate(data: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!data.diocese.trim()) errors.diocese = 'Diocese is required';
  if (!data.nameRole.trim()) errors.nameRole = 'Name & role is required';
  if (!data.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Enter a valid email address';
  return errors;
}

export default function FeedbackForm() {
  const [form, setForm] = useState<FormState>({
    diocese: '', nameRole: '', email: '', rating: 0,
    topFeature: '', changeOrAdd: '', interests: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormState, val: string | number | string[]) =>
    setForm((f) => ({ ...f, [field]: val }));

  const clearErr = (field: keyof FormErrors) =>
    setErrors((e) => ({ ...e, [field]: undefined }));

  const toggleInterest = (area: string) =>
    set('interests', form.interests.includes(area)
      ? form.interests.filter((a) => a !== area)
      : [...form.interests, area]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Server error');
      setSubmitted(true);
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="ff-ok" role="status" aria-live="polite">
        <div className="ff-ok-icon">✓</div>
        <div className="ff-ok-h">Thank you!</div>
        <p className="ff-ok-sub">
          We&apos;ve received your feedback. Someone from the Atlas team will be in touch within a
          few business days to continue the conversation.
        </p>
      </div>
    );
  }

  return (
    <form className="ff" onSubmit={onSubmit} noValidate aria-label="Founding partner feedback form">
      <h3 className="ff-h">Tell us what you think</h3>
      <p className="ff-sub">Takes 2 minutes. No sales call required.</p>

      {/* Diocese */}
      <div className="ff-field">
        <label className="ff-label" htmlFor="ff-diocese">Your Diocese *</label>
        <input
          id="ff-diocese"
          className={`ff-input${errors.diocese ? ' error' : ''}`}
          type="text"
          placeholder="Diocese of Chicago"
          value={form.diocese}
          onChange={(e) => { set('diocese', e.target.value); clearErr('diocese'); }}
          aria-invalid={!!errors.diocese}
          aria-describedby={errors.diocese ? 'ff-diocese-err' : undefined}
        />
        {errors.diocese && <span className="ff-err-msg" id="ff-diocese-err" role="alert">{errors.diocese}</span>}
      </div>

      {/* Name & Role */}
      <div className="ff-field">
        <label className="ff-label" htmlFor="ff-namerole">Your Name & Role *</label>
        <input
          id="ff-namerole"
          className={`ff-input${errors.nameRole ? ' error' : ''}`}
          type="text"
          placeholder="Jane Smith, Development Director"
          value={form.nameRole}
          onChange={(e) => { set('nameRole', e.target.value); clearErr('nameRole'); }}
          aria-invalid={!!errors.nameRole}
          aria-describedby={errors.nameRole ? 'ff-namerole-err' : undefined}
          autoComplete="name"
        />
        {errors.nameRole && <span className="ff-err-msg" id="ff-namerole-err" role="alert">{errors.nameRole}</span>}
      </div>

      {/* Email */}
      <div className="ff-field">
        <label className="ff-label" htmlFor="ff-email">Email *</label>
        <input
          id="ff-email"
          className={`ff-input${errors.email ? ' error' : ''}`}
          type="email"
          placeholder="you@diocese.org"
          value={form.email}
          onChange={(e) => { set('email', e.target.value); clearErr('email'); }}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'ff-email-err' : undefined}
          autoComplete="email"
        />
        {errors.email && <span className="ff-err-msg" id="ff-email-err" role="alert">{errors.email}</span>}
      </div>

      {/* Overall Impression — stars */}
      <div className="ff-field">
        <label className="ff-label" id="ff-rating-label">Overall Impression</label>
        <div className="stars" role="radiogroup" aria-labelledby="ff-rating-label">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`star${n <= (hover || form.rating) ? ' on' : ''}`}
              onClick={() => set('rating', n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              aria-label={`${n} star${n !== 1 ? 's' : ''}`}
              aria-pressed={form.rating === n}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Feature That Matters Most */}
      <div className="ff-field">
        <label className="ff-label" htmlFor="ff-feature">Feature That Matters Most</label>
        <select
          id="ff-feature"
          className="ff-select"
          value={form.topFeature}
          onChange={(e) => set('topFeature', e.target.value)}
        >
          <option value="">Select a feature…</option>
          {TOP_FEATURES.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* What Would You Change or Add */}
      <div className="ff-field">
        <label className="ff-label" htmlFor="ff-change">What Would You Change or Add</label>
        <textarea
          id="ff-change"
          className="ff-ta"
          placeholder="Tell us what's missing, broken, or could be better in your current setup…"
          value={form.changeOrAdd}
          onChange={(e) => set('changeOrAdd', e.target.value)}
        />
      </div>

      {/* I Am Interested In */}
      <div className="ff-field">
        <label className="ff-label">I Am Interested In</label>
        <div className="ff-checks" role="group" aria-label="Interest areas">
          {INTEREST_AREAS.map((area) => (
            <label className="ff-check" key={area}>
              <input
                type="checkbox"
                checked={form.interests.includes(area)}
                onChange={() => toggleInterest(area)}
                aria-label={area}
              />
              {area}
            </label>
          ))}
        </div>
      </div>

      <button className="ff-submit" type="submit" disabled={loading} aria-busy={loading}>
        {loading ? 'Sending…' : 'Send feedback & register interest →'}
      </button>
    </form>
  );
}
