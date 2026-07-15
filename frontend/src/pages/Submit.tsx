import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { submitPayout } from "../lib/api";
import { useDocumentMeta } from "../lib/useDocumentMeta";
import MorphButton, { type SubmitState } from "../components/MorphButton";

const PLATFORMS = ["Instagram", "TikTok", "YouTube", "X/Twitter", "Other"];
const FOLLOWER_TIERS = ["<10k", "10k-50k", "50k-200k", "200k+"];

export default function Submit() {
  useDocumentMeta(
    "Log a deal — DealBench",
    "Log one anonymous brand-deal payout — platform, follower tier, deal type, and what you got paid. No name, no handle, no exposure.",
  );

  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [followerTier, setFollowerTier] = useState(FOLLOWER_TIERS[0]);
  const [dealType, setDealType] = useState("");
  const [postCount, setPostCount] = useState("");
  const [payoutAmount, setPayoutAmount] = useState("");

  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setState("loading");
    try {
      await submitPayout({
        platform,
        followerTier,
        dealType,
        postCount: postCount === "" ? null : Number(postCount),
        payoutAmount: Number(payoutAmount),
      });
      setState("success");
      setDealType("");
      setPostCount("");
      setPayoutAmount("");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Could not log this deal.");
    }
  }

  return (
    <section className="auth-section">
      <div className="container auth-container">
        <div className="auth-panel submit-panel reveal is-visible">
          <p className="eyebrow">Log a deal</p>
          <h1>Add your number to the ledger</h1>
          <p className="sec-sub auth-sub">
            Platform, follower tier, what the deal was, what it paid. That's
            it — logged straight into the anonymous aggregate.
          </p>

          {error && <p className="auth-error" role="alert">{error}</p>}

          {state === "success" && (
            <p className="submit-success-note">
              <span className="stamp">· LOGGED ANONYMOUSLY ·</span>
              This entry is now part of the anonymous aggregate — no one can
              see it came from you.
            </p>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <label className="field">
              <span>Platform</span>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Follower tier</span>
              <select value={followerTier} onChange={(e) => setFollowerTier(e.target.value)}>
                {FOLLOWER_TIERS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Deal type</span>
              <input
                type="text"
                required
                value={dealType}
                onChange={(e) => setDealType(e.target.value)}
                placeholder="e.g. 3-post Instagram bundle"
              />
            </label>

            <label className="field">
              <span>Post count (optional)</span>
              <input
                type="number"
                min={0}
                step={1}
                value={postCount}
                onChange={(e) => setPostCount(e.target.value)}
                placeholder="e.g. 3"
              />
            </label>

            <label className="field">
              <span>Payout amount (USD)</span>
              <input
                type="number"
                required
                min={0}
                step="0.01"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="e.g. 2200"
              />
            </label>

            <MorphButton
              state={state}
              idleLabel="Log this deal"
              loadingLabel="Logging…"
              successLabel="Logged anonymously"
            />
          </form>

          <p className="auth-privacy-note">
            <span className="stamp">· ANONYMIZED ·</span> See exactly how in
            the <Link to="/privacy">Privacy Promise</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
