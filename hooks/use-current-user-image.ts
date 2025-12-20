import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export const useCurrentUserImage = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const supabase = createClient();

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error);
    }
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        sessionError ? console.error(sessionError) : null;
        setAvatarUrl(undefined);
        return;
      }

      const userId = session.user.id;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("avatar_url, username")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error(profileError);
        setAvatarUrl(undefined);
        return;
      }

      if (profile.avatar_url) {
        downloadImage(profile.avatar_url);
      }
    };

    fetchAvatar();
  }, [supabase, downloadImage]);

  return avatarUrl;
};
