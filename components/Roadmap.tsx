import FadeIn from './FadeIn';

const PHASES = [
  {
    num: '1',
    label: 'Months 1–6',
    title: 'Foundation',
    desc: 'The core data layer. Diocese and parish hierarchy, donor profiles, GiveCentral payment sync, batch giving entry, and scoped parish access controls. The database your entire diocese runs on.',
    tags: ['Diocese Hierarchy', 'Donor Profiles', 'GiveCentral Sync', 'Batch Entry', 'Parish Access'],
    active: true,
  },
  {
    num: '2',
    label: 'Months 6–18',
    title: 'Fundraising engine',
    desc: 'CMA campaign tracking, pledge management with installment schedules, major gifts pipeline, moves management, wealth screening, and email outreach automation.',
    tags: ['CMA Campaigns', 'Pledge Management', 'Major Gifts Pipeline', 'Wealth Screening', 'Email Automation'],
    active: false,
  },
  {
    num: '3',
    label: 'Months 18–30',
    title: 'AI intelligence layer',
    desc: 'Guru natural-language queries over your entire database, AI meeting brief generation, predictive donor scoring, NCOA/CASS address automation, and duplicate detection.',
    tags: ['Guru AI Queries', 'Meeting Briefs', 'Donor Scoring', 'NCOA/CASS', 'Duplicate Detection'],
    active: false,
  },
];

const ACTIVE_DESIGN = [
  'Diocese Dashboard & KPI rollup',
  'Donor 360 profile view',
  'Parish hierarchy data model',
  'GiveCentral real-time sync API',
  'Batch giving entry interface',
];

export default function Roadmap() {
  return (
    <section className="atlas-section" id="roadmap" aria-labelledby="roadmap-heading">
      <div
        className="roadmap-grid"
        style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'start' }}
      >
        {/* Left */}
        <div>
          <FadeIn><div className="sec-ey">Product Roadmap</div></FadeIn>
          <FadeIn delay={1}>
            <h2 className="sec-h" id="roadmap-heading">
              Built in three phases.<br /><em>Shipping in 2026.</em>
            </h2>
          </FadeIn>
          <FadeIn delay={2}>
            <p className="sec-sub" style={{ marginBottom: 32 }}>
              Atlas is being built with founding dioceses in the room. Each phase ships a complete,
              usable layer — no half-finished features, no big-bang launches.
            </p>
          </FadeIn>

          <FadeIn delay={3}>
            <div style={{
              background: 'rgba(200,146,10,.06)',
              border: '1px solid rgba(200,146,10,.18)',
              borderRadius: 12,
              padding: '20px 22px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12, opacity: .8 }}>
                Currently in active design
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ACTIVE_DESIGN.map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0, opacity: .7 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>

        {/* Right — timeline */}
        <FadeIn delay={2}>
          <div className="rm" role="list" aria-label="Product roadmap phases">
            {PHASES.map((phase) => (
              <div className="rm-item" key={phase.num} role="listitem">
                <div className={`rm-dot ${phase.active ? 'active' : 'soon'}`} aria-hidden="true">
                  {phase.num}
                </div>
                <div className="rm-content">
                  <div className="rm-phase">{phase.label}</div>
                  <h3 className="rm-title">{phase.title}</h3>
                  <p className="rm-desc">{phase.desc}</p>
                  <div className="rm-tags" role="list">
                    {phase.tags.map((tag) => (
                      <span className="rm-tag" key={tag} role="listitem">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
