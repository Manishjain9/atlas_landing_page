export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="atlas-footer" role="contentinfo">
      <div className="foot-text">
        © {year} GiveCentral · Atlas CRM · Early access preview
      </div>
      <nav className="foot-links" aria-label="Footer links">
        <a href="#why" className="foot-link" data-analytics-cta="Footer - Why Atlas">Why Atlas</a>
        <a href="#preview" className="foot-link" data-analytics-cta="Footer - Preview">Preview</a>
        <a href="#roadmap" className="foot-link" data-analytics-cta="Footer - Roadmap">Roadmap</a>
        <a href="#feedback" className="foot-link" data-analytics-cta="Footer - Become Partner">Become a partner</a>
        <a href="mailto:atlas@givecentral.org" className="foot-link" data-analytics-cta="Footer - Contact Email">Contact</a>
      </nav>
    </footer>
  );
}
