import { NextResponse } from 'next/server';
import { getDailyNonogramIdServer } from '@/utils/supabase/server-queries';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const id = await getDailyNonogramIdServer();
  const destination = id ? `/nonogram/${id}` : '/packs?notice=no-daily-puzzle';
  return NextResponse.redirect(new URL(destination, request.url));
}
