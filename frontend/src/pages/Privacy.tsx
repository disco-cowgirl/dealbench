import { useDocumentMeta } from "../lib/useDocumentMeta";

export default function Privacy() {
  useDocumentMeta(
    "Privacy Promise — DealBench",
    "No public attribution, email for access only, data aggregated before it's ever shown. DealBench's Privacy Promise, in three commitments.",
  );

  return (
    <section className="section privacy-section">
      <div className="container">
        <header className="sec-head reveal">
          <p className="eyebrow">The privacy promise</p>
          <h1>An auditor doesn't publish your name. Neither do we.</h1>
          <p className="sec-sub">
            We pulled thousands of verified payouts so you can see the median
            rate before you say yes to a brand — that only works if creators
            trust what happens to their data after they hit submit. Here's
            exactly what happens.
          </p>
        </header>

        <div className="privacy-blocks">
          <article className="privacy-block reveal">
            <span className="stamp">· NO PUBLIC ATTRIBUTION ·</span>
            <h2>We never show who submitted what</h2>
            <p>
              No usernames, no handles, no @ mentions, no identifying detail
              of any kind is ever displayed alongside a payout figure. A
              number in the feed is just a number — platform, follower tier,
              deal type, payout. That's the entire row.
            </p>
          </article>

          <article className="privacy-block reveal">
            <span className="stamp">· EMAIL FOR ACCESS ONLY ·</span>
            <h2>Your email unlocks your account. Nothing else.</h2>
            <p>
              We ask for an email so you can sign back in — full stop. It is
              never shown to other users, never sold to a third party, and
              never attached to any payout you submit. It lives in the
              accounts table and nowhere near the ledger.
            </p>
          </article>

          <article className="privacy-block reveal">
            <span className="stamp">· AGGREGATED BEFORE SHOWN ·</span>
            <h2>Your deal joins the median before anyone sees it</h2>
            <p>
              Every submission is folded into the aggregate — median payout
              by platform and follower tier — before it's ever surfaced to
              another creator. You're contributing to the number, not
              exposing your deal.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
