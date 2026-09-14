import { redirect } from 'next/navigation';
import { getDailyNonogramIdServer } from '@/utils/supabase/server-queries';

export const dynamic = 'force-dynamic';

export default async function DailyPage() {
  const id = await getDailyNonogramIdServer();
  redirect(id ? `/nonogram/${id}` : '/packs?notice=no-daily-puzzle');
}
