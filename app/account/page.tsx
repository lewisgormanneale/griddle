import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
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

  return (
    <div className="h-screen w-full flex flex-col items-center p-4 gap-4">
      <AccountForm user={user} />
    </div>
  );
}
