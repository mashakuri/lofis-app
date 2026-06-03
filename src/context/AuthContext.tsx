import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseConfigured } from '../lib/supabase';
import type { Role } from '../types';

type AuthCtx = {
  session: Session | null;
  user: User | null;
  role: Role | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, role: Role) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

type DemoAuth = { email: string; role: Role };

function readDemo(): DemoAuth | null { return null; }
function writeDemo(_data: DemoAuth | null) {}

function roleFromUser(user: User | null): Role | null {
  if (!user) return null;
  const meta = user.user_metadata?.role;
  return meta === 'organizer' || meta === 'student' ? meta : 'student';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [demo, setDemo] = useState<DemoAuth | null>(() => readDemo());
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const user = session?.user ?? null;
  const role = supabaseConfigured ? roleFromUser(user) : demo?.role ?? null;

  const signIn = useCallback(async (email: string, password: string) => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    }
    const d = readDemo();
    if (d?.email === email) {
      setDemo(d);
      return { error: null };
    }
    writeDemo({ email, role: 'student' });
    setDemo({ email, role: 'student' });
    return { error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, signupRole: Role) => {
    if (supabase) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: signupRole } },
      });
      return { error: error?.message ?? null };
    }
    writeDemo({ email, role: signupRole });
    setDemo({ email, role: signupRole });
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    writeDemo(null);
    setDemo(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      role,
      loading,
      configured: supabaseConfigured,
      signIn,
      signUp,
      signOut,
    }),
    [session, user, role, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error('useAuth requires AuthProvider');
  return c;
}
