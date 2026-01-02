import { useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/auth-js';
import { createClient } from '@/utils/supabase/client';

export function useAuthUser() {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) {
        return;
      }
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) {
        return;
      }
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, loading };
}
