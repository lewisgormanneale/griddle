import { redirect } from 'next/navigation';
import AccountForm from '@/components/account/account-form';
import { createClient } from '@/utils/supabase/server';

export default async function AccountSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login?next=/account-settings');
  }

  return <AccountForm user={user} />;
}
