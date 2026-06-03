export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="atlas-footer" role="contentinfo">
      <div className="foot-text">
        © {year} GiveCentral · Atlas CRM · Early access preview
      </div>
      <nav className="foot-links" aria-label="Footer links">
        <a href="#why" className="foot-link">Why Atlas</a>
        <a href="#preview" className="foot-link">Preview</a>
        <a href="#roadmap" className="foot-link">Roadmap</a>
        <a href="#feedback" className="foot-link">Become a partner</a>
        <a href="mailto:atlas@givecentral.org" className="foot-link">Contact</a>
      </nav>
    </footer>
  );
}
