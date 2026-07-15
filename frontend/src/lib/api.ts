export interface SessionUser {
  email: string;
}

async function parseJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

export async function fetchMe(): Promise<SessionUser | null> {
  const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
  if (!res.ok) return null;
  const data = await parseJson(res);
  return data.user ?? null;
}

export async function signup(email: string, password: string): Promise<SessionUser> {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || 'Signup failed.');
  return data.user;
}

export async function signin(email: string, password: string): Promise<SessionUser> {
  const res = await fetch('/api/auth/signin', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || 'Invalid email or password.');
  return data.user;
}

export async function signout(): Promise<void> {
  await fetch('/api/auth/signout', { method: 'POST', credentials: 'same-origin' });
}

export interface PayoutSubmission {
  platform: string;
  followerTier: string;
  dealType: string;
  postCount?: number | null;
  payoutAmount: number;
}

export async function submitPayout(payload: PayoutSubmission): Promise<void> {
  const res = await fetch('/api/submissions', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || 'Could not log this deal.');
}

export interface FeedEntry {
  platform: string;
  followerTier: string;
  dealType: string;
  postCount: number | null;
  payoutAmount: number;
  createdAt: string;
}

export interface PlatformTierMedian {
  platform: string;
  followerTier: string;
  median: number;
  count: number;
}

export interface SubmissionsResponse {
  count: number;
  medianOverall: number | null;
  recent: FeedEntry[];
  byPlatformTier: PlatformTierMedian[];
}

export async function fetchSubmissions(): Promise<SubmissionsResponse> {
  const res = await fetch('/api/submissions', { credentials: 'same-origin' });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || 'Could not load payout data.');
  return data;
}
