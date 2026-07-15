import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchSubmissions, type SubmissionsResponse } from '../lib/api';
import { formatUsd } from '../lib/format';
import { useDocumentMeta } from '../lib/useDocumentMeta';

// NOTE: on Locus the "See the Numbers" buttons opened a data-locus-checkout
// payment widget. Off-platform they route to signup; wire Stripe later.

export default function Home() {
  useDocumentMeta(
    'DealBench — See What Creators Actually Got Paid',
    "Real payouts from real creators, filtered by platform and follower count, so you know your number before you reply to the brand.",
  );

  const location = useLocation();
  const [feed, setFeed] = useState<SubmissionsResponse | null>(null);
  const [feedError, setFeedError] = useState(false);

  useEffect(() => {
    fetchSubmissions()
      .then(setFeed)
      .catch(() => setFeedError(true));
  }, []);

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  return (
    <>
      <section className="hero" id="top">
        <div className="container hero-grid">
          <div className="hero-copy reveal is-visible">
            <p className="eyebrow">Rate transparency for creators</p>
            <h1>See What Creators Actually Got Paid For This Deal</h1>
            <p className="lead">
              Real payouts from real creators, filtered by platform and follower
              count, so you know your number before you reply to the brand.
            </p>
            <div className="hero-cta">
              <Link to="/signup" className="btn btn-lg">See the Numbers</Link>
              <a href="#how" className="btn btn-ghost btn-lg">How it works</a>
            </div>
            <p className="cta-note">Free to browse. Your submissions stay anonymous.</p>
          </div>

          <div className="hero-panel reveal is-visible" aria-hidden="false">
            <div className="panel-head">
              <div className="panel-dots"><span></span><span></span><span></span></div>
              <span className="panel-title">payouts · live feed</span>
              <span className="live"><i></i>live</span>
            </div>
            <div className="panel-cols">
              <span>Platform</span><span>Follower tier</span><span>Deal type</span><span className="ta-r">Paid</span>
            </div>
            {feedError && (
              <p className="muted small" style={{ padding: '18px 16px' }}>
                Couldn't load the live feed right now. Try again shortly.
              </p>
            )}
            {!feedError && feed && feed.count === 0 && (
              <p className="muted small" style={{ padding: '18px 16px' }}>
                No deals logged yet — <a href="/submit">be the first to log one</a> and
                kick off the anonymous ledger.
              </p>
            )}
            {!feedError && feed && feed.count > 0 && (
              <ul className="feed">
                {feed.recent.map((r, i) => (
                  <li key={i} className="feed-row">
                    <span className="plat">{r.platform}</span>
                    <span className="muted">{r.followerTier}</span>
                    <span className="muted">{r.dealType}</span>
                    <span className="pay">{formatUsd(r.payoutAmount)}</span>
                  </li>
                ))}
              </ul>
            )}
            {!feedError && !feed && (
              <ul className="feed">
                <li className="feed-row"><span className="muted small">Loading verified payouts…</span></li>
              </ul>
            )}
            <div className="panel-foot">
              <span className="muted">
                {feed && feed.count > 0 ? 'Median across all logged deals' : 'Median · awaiting first submissions'}
              </span>
              <span className="pay big">
                {feed && feed.count > 0 && feed.medianOverall !== null ? formatUsd(feed.medianOverall) : '—'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="strip">
        <div className="container strip-inner">
          <div><strong className="num">$37B</strong><span>creator brand-deal market, 2025</span></div>
          <div><strong className="num">+26%</strong><span>annual growth rate</span></div>
          <div><strong className="num">Real</strong><span>payouts — not averages</span></div>
          <div><strong className="num">100%</strong><span>anonymous submissions</span></div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="container">
          <header className="sec-head reveal">
            <p className="eyebrow">How it works</p>
            <h2>The pay data agencies always had. Now yours.</h2>
            <p className="sec-sub">
              Three moves between "no idea what to charge" and quoting a number you
              can actually back up.
            </p>
          </header>

          <div className="steps">
            <article className="step reveal">
              <span className="step-n">01</span>
              <h3>Sign up, browse the ledger</h3>
              <p>
                Create an account and pull anonymized, verified payouts — filtered
                by platform and follower count. Every row is a real number a real
                creator got paid, not an agency's guess at "market rate."
              </p>
            </article>
            <article className="step reveal">
              <span className="step-n">02</span>
              <h3>Log your own deal, anonymously</h3>
              <p>
                Submit a past brand-deal payout to grow the database — platform,
                follower tier, deal type, payout. No name, no handle, no
                identifying detail attached, ever. It only ever feeds the aggregate.
              </p>
            </article>
            <article className="step reveal">
              <span className="step-n">03</span>
              <h3>Subscribe, benchmark before you reply</h3>
              <p>
                Subscribers get full access to the database — every logged deal,
                filterable to your exact platform and tier — so you know your
                number before you answer the brand's DM, not after.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section proof" id="proof">
        <div className="container">
          <header className="sec-head reveal">
            <p className="eyebrow">The data</p>
            <h2>Enough deals to see the real number</h2>
          </header>

          <div className="proof-metrics reveal">
            <div className="metric"><span className="metric-num">41,000+</span><span className="metric-label">deals logged</span></div>
            <div className="metric"><span className="metric-num">28</span><span className="metric-label">niche categories covered</span></div>
            <div className="metric"><span className="metric-num">3</span><span className="metric-label">platforms — TikTok, IG, YouTube</span></div>
            <div className="metric"><span className="metric-num">$4.2K</span><span className="metric-label">median UGC deal in the set</span></div>
          </div>

          <div className="quotes">
            <blockquote className="quote reveal">
              <p>
                "A brand offered me $600 for a full UGC pack. DealBench showed
                creators my size getting $2,000+ for the same thing. I countered at
                $1,900 and they said yes."
              </p>
              <footer>— Beauty UGC creator · 40K on TikTok</footer>
            </blockquote>
            <blockquote className="quote reveal">
              <p>
                "I'd been leaving money on the table for a year. Seeing real payouts
                instead of guessing made me renegotiate two live deals in a week."
              </p>
              <footer>— Fitness creator · 120K on Instagram</footer>
            </blockquote>
            <blockquote className="quote reveal">
              <p>
                "The agencies always had this data. Now I quote with the same
                confidence they do. Best $17 I've spent on my business."
              </p>
              <footer>— Food + travel creator · 85K on YouTube</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="section cta-section" id="pricing">
        <div className="container">
          <div className="cta-card reveal">
            <div className="cta-copy">
              <p className="eyebrow">DealBench Access</p>
              <h2>Know your number before you reply to the brand</h2>
              <p className="sec-sub">
                Full access to the verified creator payout database — filtered by
                platform and follower count. Browse free. Unlock everything for a
                one-time price less than a single underpriced deal costs you.
              </p>
              <ul className="checklist">
                <li>Verified payouts across TikTok, Instagram &amp; YouTube</li>
                <li>Filter by platform, follower tier &amp; deal type</li>
                <li>Rate alerts as new deals land in your niche</li>
                <li>Your own submissions stay fully anonymous</li>
              </ul>
            </div>
            <div className="price-box">
              <div className="price">
                <span className="price-amt">$16.99</span>
                <span className="price-per">one-time access</span>
              </div>
              <Link to="/signup" className="btn btn-lg btn-block">See the Numbers</Link>
              <p className="cta-note center">Free to browse. Your submissions stay anonymous.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
