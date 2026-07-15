import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchMe, signin as apiSignin, signout as apiSignout, signup as apiSignup, type SessionUser } from './api';

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const signin = useCallback(async (email: string, password: string) => {
    const u = await apiSignin(email, password);
    setUser(u);
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const u = await apiSignup(email, password);
    setUser(u);
  }, []);

  const signout = useCallback(async () => {
    await apiSignout();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, signin, signup, signout }), [user, loading, signin, signup, signout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
