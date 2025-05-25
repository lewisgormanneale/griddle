import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export const useCurrentUserImage = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [initials, setInitials] = useState<string | undefined>(undefined);
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
        console.error(sessionError);
        setAvatarUrl(undefined);
        setInitials("?");
        return;
      }

      const userId = session.user.id;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("avatar_url, full_name")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error(profileError);
        setAvatarUrl(undefined);
        setInitials("?");
        return;
      }

      if (profile.avatar_url) {
        downloadImage(profile.avatar_url);
      } else if (profile.full_name) {
        const nameParts = profile.full_name.split(" ");
        const initials = nameParts
          .slice(0, 2)
          .map((part: string) => part[0]?.toUpperCase() || "")
          .join("");
        setInitials(initials || "?");
      } else {
        setInitials("?");
      }
    };

    fetchAvatar();
  }, [supabase]);

  return { avatarUrl, initials };
};
