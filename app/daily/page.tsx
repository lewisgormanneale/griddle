import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Stack, Text, Title } from '@mantine/core';
import { PageHeader } from '@/components/layout/page-header';
import Pack from '@/components/packs/pack';
import {
  getDailyNonogramIdServer,
  getNonogramHintsServer,
  getNonogramServer,
  getPackById,
} from '@/utils/supabase/server-queries';
import { NonogramClient } from '../nonogram/[id]/nonogram-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Today's Puzzle",
  description: 'Solve today’s daily nonogram.',
};

export default async function DailyPage() {
  const id = await getDailyNonogramIdServer();
  if (!id) {
    redirect('/packs?notice=no-daily-puzzle');
  }

  const nonogram = await getNonogramServer(id);
  if (!nonogram) {
    redirect('/packs?notice=no-daily-puzzle');
  }

  const { rows, columns } = await getNonogramHintsServer(id);
  const pack = nonogram.pack_id ? await getPackById(nonogram.pack_id) : undefined;

  return (
    <Stack gap="xl">
      <PageHeader
        title="Today's Puzzle"
        description={nonogram.title}
        align="left"
        testId="daily-header"
      />
      <NonogramClient nonogram={nonogram} rowHints={rows} columnHints={columns} />
      {pack && (
        <Stack gap="xs" data-testid="daily-pack">
          <div>
            <Title order={2}>More from {pack.name}</Title>
            <Text c="dimmed" size="sm">
              Haven&apos;t caught up on the rest of this month&apos;s puzzles yet? Explore them
              below.
            </Text>
          </div>
          <Pack pack={pack} />
        </Stack>
      )}
    </Stack>
  );
}
