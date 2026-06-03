import FadeIn from './FadeIn';

const CARDS = [
  {
    num: '01',
    title: 'Native GiveCentral integration',
    body: 'Every gift through GiveCentral posts directly to the right donor record in real time. No middleware, no nightly sync, no spreadsheet exports. The payment platform and the CRM are one system.',
  },
  {
    num: '02',
    title: 'Diocese → Parish hierarchy built in',
    body: 'Atlas is the only CRM with Diocese, Parish, Household, and Individual as first-class entities. CMA parish progress, pastor-scoped reports, and diocesan rollup all work exactly as your team expects.',
  },
  {
    num: '03',
    title: 'Guru AI — query in plain English',
    body: '"Show me donors who gave to last year\'s capital campaign but haven\'t pledged this year." Type it. Guru answers it. No reports to build, no exports to run — your data talks back.',
  },
  {
    num: '04',
    title: 'Pledge management that actually works',
    body: 'Committed vs. cash received. Installment tracking. Past due reports. Write-off workflow with diocese approval. Cash flow projections. Everything your finance team needs, not an afterthought.',
  },
  {
    num: '05',
    title: 'Address hygiene built in',
    body: 'NCOA, CASS, deceased record monitoring, email validation — all automated before every mailing. Atlas protects your CMA budget by keeping your list clean without manual effort.',
  },
  {
    num: '06',
    title: 'Parish access — right data, right person',
    body: 'Pastors get clear parish reports. Parish admins get scoped donor access. The diocese sees everything. One database, intelligent access controls, no confusion about who sees what.',
  },
];

export default function WhySection() {
  return (
    <section className="atlas-section" id="why" aria-labelledby="why-heading">
      <FadeIn><div className="sec-ey">Why Atlas</div></FadeIn>
      <FadeIn delay={1}><h2 className="sec-h" id="why-heading">Built for the way <em>you</em> actually work</h2></FadeIn>
      <FadeIn delay={2}>
        <p className="sec-sub">
          Every other CRM makes Catholic dioceses adapt to a generic nonprofit structure. Atlas was
          designed from the ground up around the diocese–parish hierarchy, the CMA, and the way
          Catholic stewardship actually works.
        </p>
      </FadeIn>
      <FadeIn delay={3}>
        <div className="why-grid" role="list" aria-label="Key differentiators">
          {CARDS.map((c) => (
            <article className="why-card" key={c.num} role="listitem">
              <div className="why-num">{c.num}</div>
              <h3 className="why-title">{c.title}</h3>
              <p className="why-body">{c.body}</p>
            </article>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
