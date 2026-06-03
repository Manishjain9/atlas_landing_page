import FadeIn from './FadeIn';
import FeedbackForm from './FeedbackForm';

const PERKS = [
  {
    title: '50% off migration',
    body: 'Your data migrated from Raiser\'s Edge or any existing CRM at half our standard migration rate.',
  },
  {
    title: 'Direct product influence',
    body: 'Monthly sessions with the Atlas product team. Your workflows shape what gets built and in what order.',
  },
  {
    title: 'First live',
    body: 'Your diocese goes live on Atlas before any public launch — with dedicated implementation support.',
  },
  {
    title: '2028 parish pathway',
    body: 'Your parishes get self-service access and the parish portal rolled out as a priority in Phase 3.',
  },
  {
    title: 'Founding recognition',
    body: 'Recognized as a founding diocese partner in the product, at GiveCentral events, and in press.',
  },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FounderSection() {
  return (
    <section className="atlas-section" id="feedback" aria-labelledby="founder-heading">
      <div className="founder-wrap">
        <div className="founder-grid">
          {/* Left column */}
          <div>
            <FadeIn>
              <div className="founder-badge">
                ★ Founding partner programme · 5 spots available
              </div>
            </FadeIn>

            <FadeIn delay={1}>
              <h2 className="founder-h" id="founder-heading">
                Help shape Atlas.<br />
                <em>Launch it with us.</em>
              </h2>
            </FadeIn>

            <FadeIn delay={2}>
              <p className="founder-body">
                We&apos;re inviting five founding dioceses to shape Atlas from the ground up — not as beta
                testers, but as co-builders. You&apos;ll have direct access to the product team, your
                real workflows will drive design decisions, and you&apos;ll launch on Atlas before anyone else.
              </p>
              <p className="founder-body">
                In exchange, we ask for honest feedback, real use cases, and the willingness to tell
                us when something isn&apos;t working. Two spots are already in conversation.
              </p>
            </FadeIn>

            <FadeIn delay={3}>
              <div className="perks" role="list" aria-label="Founding partner benefits">
                {PERKS.map((p) => (
                  <div className="perk" key={p.title} role="listitem">
                    <div className="perk-ck"><CheckIcon /></div>
                    <span>
                      <strong>{p.title}</strong> — {p.body}
                    </span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right column — form */}
          <FadeIn delay={2}>
            <FeedbackForm />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
