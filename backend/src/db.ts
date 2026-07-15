import { Pool } from 'pg';

// Reads the Postgres connection string from DATABASE_URL (standard on
// Render/Railway/Neon/Supabase). pg_DATABASE_URL kept for compatibility
// with the original Locus deployment.
const connectionString = process.env.DATABASE_URL || process.env.pg_DATABASE_URL;
if (!connectionString) {
  console.error(
    'DATABASE_URL is not set. DB-backed routes will fail until it is set.',
  );
}

export const pool = new Pool({
  connectionString: connectionString || 'postgres://invalid:invalid@localhost:5432/invalid',
  // Managed Postgres providers (Neon, Supabase, Render) require SSL.
  ssl: connectionString && connectionString.includes('localhost') ? undefined : { rejectUnauthorized: false },
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS payouts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      platform TEXT NOT NULL,
      follower_tier TEXT NOT NULL,
      deal_type TEXT NOT NULL,
      post_count INTEGER,
      payout_amount NUMERIC NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}
