import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { pool, initDb } from './db';
import { attachUser, requireAuth, signSession, SESSION_COOKIE } from './auth';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 8080;
const isProd = process.env.NODE_ENV === 'production';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(attachUser);

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'X/Twitter', 'Other'];
const FOLLOWER_TIERS = ['<10k', '10k-50k', '50k-200k', '200k+'];

function setSessionCookie(res: express.Response, token: string) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

// ---------- Auth ----------

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (typeof email !== 'string' || typeof password !== 'string' || !email.includes('@') || password.length < 8) {
      res.status(400).json({ error: 'Enter a valid email and a password of at least 8 characters.' });
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'Email already registered.' });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const inserted = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [normalizedEmail, passwordHash],
    );
    const user = inserted.rows[0];
    const token = signSession({ userId: user.id, email: user.email });
    setSessionCookie(res, token);
    res.status(201).json({ user: { email: user.email } });
  } catch (err) {
    console.error('signup failed', err);
    res.status(500).json({ error: 'Signup failed. Try again.' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Enter your email and password.' });
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    const result = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1', [normalizedEmail]);
    const user = result.rows[0];
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }
    const token = signSession({ userId: user.id, email: user.email });
    setSessionCookie(res, token);
    res.status(200).json({ user: { email: user.email } });
  } catch (err) {
    console.error('signin failed', err);
    res.status(500).json({ error: 'Sign in failed. Try again.' });
  }
});

app.post('/api/auth/signout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  res.status(200).json({ ok: true });
});

// Always 200 here — "no session" is a normal, expected state for a page
// load, not an error condition. Returning 401 makes every anonymous visit
// log a noisy failed request in the browser console.
app.get('/api/auth/me', (req, res) => {
  if (!req.user) {
    res.status(200).json({ user: null });
    return;
  }
  res.status(200).json({ user: { email: req.user.email } });
});

// ---------- Submissions ----------

app.post('/api/submissions', requireAuth, async (req, res) => {
  try {
    const { platform, followerTier, dealType, postCount, payoutAmount } = req.body ?? {};
    if (typeof platform !== 'string' || !PLATFORMS.includes(platform)) {
      res.status(400).json({ error: 'Choose a valid platform.' });
      return;
    }
    if (typeof followerTier !== 'string' || !FOLLOWER_TIERS.includes(followerTier)) {
      res.status(400).json({ error: 'Choose a valid follower tier.' });
      return;
    }
    if (typeof dealType !== 'string' || dealType.trim().length === 0) {
      res.status(400).json({ error: 'Describe the deal type.' });
      return;
    }
    const amount = Number(payoutAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      res.status(400).json({ error: 'Enter a payout amount greater than zero.' });
      return;
    }
    const posts = postCount === undefined || postCount === null || postCount === '' ? null : Number(postCount);
    if (posts !== null && (!Number.isFinite(posts) || posts < 0)) {
      res.status(400).json({ error: 'Post count must be a non-negative number.' });
      return;
    }

    await pool.query(
      `INSERT INTO payouts (user_id, platform, follower_tier, deal_type, post_count, payout_amount)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [req.user!.userId, platform, followerTier, dealType.trim(), posts, amount],
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('submission failed', err);
    res.status(500).json({ error: 'Could not log this deal. Try again.' });
  }
});

// Public, anonymized read. Never selects user_id or email.
app.get('/api/submissions', async (_req, res) => {
  try {
    const recentResult = await pool.query(
      `SELECT platform, follower_tier AS "followerTier", deal_type AS "dealType",
              post_count AS "postCount", payout_amount AS "payoutAmount", created_at AS "createdAt"
       FROM payouts
       ORDER BY created_at DESC
       LIMIT 8`,
    );

    const aggResult = await pool.query(
      `SELECT platform, follower_tier AS "followerTier",
              percentile_cont(0.5) WITHIN GROUP (ORDER BY payout_amount) AS median,
              count(*)::int AS count
       FROM payouts
       GROUP BY platform, follower_tier
       ORDER BY count DESC`,
    );

    const overallResult = await pool.query(
      `SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY payout_amount) AS median, count(*)::int AS count
       FROM payouts`,
    );

    const overall = overallResult.rows[0];

    res.status(200).json({
      count: Number(overall?.count ?? 0),
      medianOverall: overall?.median !== null && overall?.median !== undefined ? Number(overall.median) : null,
      recent: recentResult.rows.map((r) => ({
        ...r,
        payoutAmount: Number(r.payoutAmount),
      })),
      byPlatformTier: aggResult.rows.map((r) => ({
        platform: r.platform,
        followerTier: r.followerTier,
        median: Number(r.median),
        count: r.count,
      })),
    });
  } catch (err) {
    // The public feed backs the homepage hero — a transient DB hiccup
    // shouldn't blank the page with a hard error. Degrade to an honest
    // "no data yet" shape instead of 500.
    console.error('fetch submissions failed, degrading to empty state', err);
    res.status(200).json({
      count: 0,
      medianOverall: null,
      recent: [],
      byPlatformTier: [],
    });
  }
});

app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

// ---------- Static frontend (production) ----------
const publicDir = path.join(__dirname, '..', 'public');
if (existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      next();
      return;
    }
    res.sendFile(path.join(publicDir, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.status(200).json({
      name: 'DealBench API',
      routes: [
        { method: 'POST', path: '/api/auth/signup', desc: 'Create an account { email, password }' },
        { method: 'POST', path: '/api/auth/signin', desc: 'Sign in { email, password }' },
        { method: 'POST', path: '/api/auth/signout', desc: 'Clear session' },
        { method: 'GET', path: '/api/auth/me', desc: 'Current session user' },
        { method: 'POST', path: '/api/submissions', desc: 'Log a payout (auth required)' },
        { method: 'GET', path: '/api/submissions', desc: 'Anonymized payout feed + medians (public)' },
      ],
    });
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`DealBench API listening on :${PORT}`);
});

// Run schema migrations in the background so the health check passes even
// while the DB is still coming up.
initDb()
  .then(() => console.log('Database schema ready.'))
  .catch((err) => {
    console.error('Database not reachable yet — DB-backed routes will 500 until it is.', err.message);
  });
