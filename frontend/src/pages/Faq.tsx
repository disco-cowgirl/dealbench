import { useState } from "react";
import { Link } from "react-router-dom";
import { useDocumentMeta } from "../lib/useDocumentMeta";

type QA = {
  stamp: string;
  q: string;
  a: JSX.Element;
};

const items: QA[] = [
  {
    stamp: "· ANONYMIZED ·",
    q: "How does anonymized payout data actually work?",
    a: (
      <p>
        Every submission gets stripped down to the row that matters: platform,
        follower tier, deal type, payout. No name, no handle, no brand, no
        timestamp trail back to a person. Once it's in the ledger it's a
        number sitting next to other numbers — that's the whole point. You
        can't reverse-engineer a creator from a median.
      </p>
    ),
  },
  {
    stamp: "· ANONYMIZED ·",
    q: "How do you keep my submission anonymous — for real?",
    a: (
      <p>
        We never display a username, @ handle, or any identifying detail
        alongside a payout figure — publicly, that data doesn't exist. Your
        email is stored only so you can sign back into your account; it's
        never shown to other users, never sold, and never attached to a
        payout in the feed. Read the full breakdown on the{" "}
        <Link to="/privacy">Privacy Promise</Link> page if you want the
        receipts.
      </p>
    ),
  },
  {
    stamp: "· VERIFIED ·",
    q: "What's actually included in DealBench Access ($16.99)?",
    a: (
      <p>
        One-time access unlocks the full verified payout database — every
        deal logged, filterable by platform, follower tier, and deal type.
        You get rate alerts when new payouts land in your niche, and
        unlimited browsing going forward. No recurring charge, no upsell —
        you pay once, the ledger stays open.
      </p>
    ),
  },
  {
    stamp: "· LOG A DEAL ·",
    q: "How do I submit a deal?",
    a: (
      <p>
        Sign up, then hit <Link to="/submit">Submit a deal</Link>. Enter the
        platform, your follower tier, the deal type, and what you got paid —
        four fields, no name attached. That single entry folds into the
        median before anyone else ever sees it, and it's what keeps the whole
        database honest.
      </p>
    ),
  },
  {
    stamp: "· VERIFIED ·",
    q: "How accurate is this data — is it actually verified?",
    a: (
      <p>
        Every figure is self-reported by the creator who received it — we're
        not scraping estimates or averaging agency guesses. We run pattern
        checks against platform, follower tier, and deal type to flag entries
        that look inconsistent with the surrounding data before they count
        toward a median. It's not an audited financial statement; it's real
        numbers from real deals, which already beats guessing.
      </p>
    ),
  },
  {
    stamp: "· CANCEL ANYTIME ·",
    q: "How do I cancel or close my account?",
    a: (
      <p>
        DealBench Access is a one-time unlock, not a subscription you need to
        cancel. If you want your account and login removed entirely, email{" "}
        <a href="mailto:dealbench@agentmail.to">dealbench@agentmail.to</a> and
        we'll close it out — your past submissions stay in the aggregate
        median (they were never tied to your identity to begin with), and
        your account record is deleted.
      </p>
    ),
  },
];

export default function Faq() {
  useDocumentMeta(
    "FAQ — DealBench",
    "How anonymized payout data works, what DealBench Access includes, how to submit a deal, and how we verify accuracy.",
  );

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section faq-section">
      <div className="container">
        <header className="sec-head reveal">
          <p className="eyebrow">Questions, answered like a ledger</p>
          <h1>Everything before you hit submit.</h1>
          <p className="sec-sub">
            No vague "know your worth" talk here — just how the data gets
            collected, verified, and kept anonymous, and what you get for
            $16.99.
          </p>
        </header>

        <div className="faq-list">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <article className="faq-item reveal" key={item.q}>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="stamp">{item.stamp}</span>
                  <span className="faq-question-row">
                    <span>{item.q}</span>
                    <span className="faq-toggle" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </span>
                </button>
                {isOpen && <div className="faq-answer">{item.a}</div>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
