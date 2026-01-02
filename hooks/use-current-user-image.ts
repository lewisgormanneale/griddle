import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { logError } from '@/utils/logger';

export const useCurrentUserImage = (userId?: string) => {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const supabase = useMemo(() => createClient(), []);

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      logError('Error downloading image', error);
    }
  };

  useEffect(() => {
    if (!userId) {
      setAvatarUrl(undefined);
      return;
    }

    let cancelled = false;

    const fetchAvatar = async () => {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('avatar_url, username')
        .eq('id', userId)
        .single();

      if (profileError || cancelled) {
        if (profileError) {
          logError('Error fetching profile for avatar', profileError);
        }
        setAvatarUrl(undefined);
        return;
      }

      if (profile?.avatar_url) {
        downloadImage(profile.avatar_url);
      } else {
        setAvatarUrl(undefined);
      }
    };

    fetchAvatar();

    return () => {
      cancelled = true;
    };
  }, [supabase, userId]);

  return avatarUrl;
};
