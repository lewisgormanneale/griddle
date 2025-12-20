"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return <Button onClick={logout}>Logout</Button>;
}
