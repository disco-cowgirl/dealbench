import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { useDocumentMeta } from "../lib/useDocumentMeta";
import MorphButton, { type SubmitState } from "../components/MorphButton";

export default function Signin() {
  useDocumentMeta(
    "Sign in — DealBench",
    "Sign in to log a brand-deal payout or check your account access on DealBench.",
  );

  const { signin } = useAuth();
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
      await signin(email, password);
      setState("success");
      setTimeout(() => navigate(from, { replace: true }), 400);
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Invalid email or password.");
    }
  }

  return (
    <section className="auth-section">
      <div className="container auth-container">
        <div className="auth-panel reveal is-visible">
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in</h1>
          <p className="sec-sub auth-sub">
            Same email and password you signed up with. Nothing else to
            remember.
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
              />
            </label>

            <MorphButton
              state={state}
              idleLabel="Sign in"
              loadingLabel="Signing in…"
              successLabel="Signed in"
            />
          </form>

          <p className="auth-switch">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
