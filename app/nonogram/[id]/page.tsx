import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Stack } from '@mantine/core';
import { PageHeader } from '@/components/layout/page-header';
import type { NonogramWithProfile } from '@/utils/supabase/queries';
import { getNonogramHintsServer, getNonogramServer } from '@/utils/supabase/server-queries';
import { NonogramClient } from './nonogram-client';

const buildDescription = (nonogram: NonogramWithProfile) =>
  `${nonogram.height} x ${nonogram.width}${
    nonogram.profiles?.username ? ` | ${nonogram.profiles.username}` : ''
  }`;

const buildTitle = (id: number, nonogram?: NonogramWithProfile) => {
  if (!nonogram) {return `Nonogram #${id}`;}
  return `Nonogram #${id}: ${nonogram.title}`;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id)) {
    return {
      title: 'Nonogram',
    };
  }

  const nonogram = await getNonogramServer(id);
  if (!nonogram) {
    return {
      title: `Nonogram #${id} not found`,
    };
  }

  return {
    title: buildTitle(id, nonogram),
    description: buildDescription(nonogram),
  };
}

export default async function NonogramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id)) {
    notFound();
  }

  const nonogram = await getNonogramServer(id);
  if (!nonogram) {
    notFound();
  }

  const { rows, columns } = await getNonogramHintsServer(id);
  const title = buildTitle(id, nonogram);

  return (
    <Stack gap="md">
      <PageHeader title={title} align="left" testId="nonogram-header" />
      <NonogramClient nonogram={nonogram} rowHints={rows} columnHints={columns} />
    </Stack>
  );
}
