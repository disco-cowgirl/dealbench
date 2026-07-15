import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

// NOTE: on Locus this was a data-locus-checkout payment button.
// Off-platform, "See the Numbers" routes to signup; wire Stripe later.
export default function SiteHeader() {
  const { user, loading, signout } = useAuth();
  const navigate = useNavigate();

  async function handleSignout() {
    await signout();
    navigate('/');
  }

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand" aria-label="DealBench home">
          <span className="brand-mark" aria-hidden="true">◧</span>
          DealBench
        </Link>
        <nav className="nav-links" aria-label="Primary">
          <Link to="/#how">How it works</Link>
          <Link to="/#proof">The data</Link>
          <Link to="/#pricing">Access</Link>
          <Link to="/submit">Log a deal</Link>
        </nav>
        {!loading && !user && (
          <div className="nav-auth">
            <Link to="/signin" className="btn btn-ghost btn-sm">Sign in</Link>
            <Link to="/signup" className="btn btn-sm">See the Numbers</Link>
          </div>
        )}
        {!loading && user && (
          <div className="nav-auth">
            <button onClick={handleSignout} className="btn btn-ghost btn-sm">Sign out</button>
            <Link to="/submit" className="btn btn-sm">Log a deal</Link>
          </div>
        )}
      </div>
    </header>
  );
}
