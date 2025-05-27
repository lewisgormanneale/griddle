import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Tables } from "@/types/database.types";

export const useCurrentUserProfile = () => {
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        if (sessionError) console.error(sessionError);
        setProfile(null);
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setError(profileError.message);
        setProfile(null);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  return { profile, loading, error };
};
