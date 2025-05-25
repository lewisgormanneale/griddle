import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import AccountForm from "@/components/account/account-form";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return <AccountForm user={user} />;
}
