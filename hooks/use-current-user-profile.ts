import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Tables } from '@/types/database.types';
import { logError } from '@/utils/logger';

export const useCurrentUserProfile = (userId?: string) => {
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (cancelled) {
        return;
      }

      if (profileError) {
        logError('Error fetching profile', profileError);
        setError(profileError.message);
        setProfile(null);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [supabase, userId]);

  return { profile, loading, error };
};
