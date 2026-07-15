import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="brand"><span className="brand-mark" aria-hidden="true">◧</span>DealBench</span>
        <p className="muted small">
          Crowdsourced payout data. Figures are self-reported by creators and
          provided for reference only — not financial advice.
        </p>
        <div className="footer-social">
          <Link to="/privacy" className="social-link footer-privacy-link">
            Privacy Promise
          </Link>
          <Link to="/faq" className="social-link footer-privacy-link">
            FAQ
          </Link>
          <a
            href="mailto:dealbench@agentmail.to"
            className="social-link"
          >
            Contact
          </a>
          <a
            href="https://x.com/DealBenchHQ"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="DealBench on X (Twitter)"
            className="social-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>@DealBenchHQ</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
