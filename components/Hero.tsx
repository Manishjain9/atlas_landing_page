export default function Hero() {
  return (
    <section className="hero" id="home" aria-label="Hero">
      <div className="hero-orb-1" aria-hidden="true" />
      <div className="hero-orb-2" aria-hidden="true" />

      <div className="hero-ey" aria-label="GiveCentral · Early access preview · 2026">
        GiveCentral · Early access preview · 2026
      </div>

      <h1 className="hero-title">
        The donor CRM built<br />
        <em>for Catholic dioceses.</em> Finally.
      </h1>

      <p className="hero-sub">
        Atlas is built natively on GiveCentral&apos;s giving infrastructure, designed around the
        Diocese → Parish → Household hierarchy your team actually works in — not retrofitted from
        a generic nonprofit platform.
      </p>

      <div className="hero-acts">
        <a href="#preview" className="btn-p" data-analytics-cta="Hero - Explore Screens">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="13" height="13" aria-hidden="true">
            <circle cx="7" cy="7" r="5.5" />
            <path d="M5.5 5l3 2-3 2V5z" fill="currentColor" />
          </svg>
          Explore 22 live screens
        </a>
        <a href="#feedback" className="btn-g" data-analytics-cta="Hero - Share Feedback">Share your feedback →</a>
      </div>

      <div className="scroll-ind" aria-hidden="true">
        <div className="scroll-line" />
        Scroll to explore
      </div>
    </section>
  );
}
