import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { useDocumentMeta } from "../lib/useDocumentMeta";
import MorphButton, { type SubmitState } from "../components/MorphButton";

export default function Signup() {
  useDocumentMeta(
    "Create your account — DealBench",
    "Sign up with an email and password to log anonymous brand-deal payouts and unlock the verified rate database.",
  );

  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/submit";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setState("loading");
    try {
      await signup(email, password);
      setState("success");
      setTimeout(() => navigate(from, { replace: true }), 500);
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Signup failed.");
    }
  }

  return (
    <section className="auth-section">
      <div className="container auth-container">
        <div className="auth-panel reveal is-visible">
          <p className="eyebrow">Create account</p>
          <h1>Get a login, not a profile</h1>
          <p className="sec-sub auth-sub">
            One email, one password. No handle, no bio, no public footprint —
            just access to log deals and see the aggregate.
          </p>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </label>

            <MorphButton
              state={state}
              idleLabel="Create account"
              loadingLabel="Creating account…"
              successLabel="Account created"
            />
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
          <p className="auth-privacy-note">
            Read the <Link to="/privacy">Privacy Promise</Link> — your email
            is for access only, never shown or sold.
          </p>
        </div>
      </div>
    </section>
  );
}
