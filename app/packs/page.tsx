import type { Metadata } from 'next';
import { Stack } from '@mantine/core';
import { PageHeader } from '@/components/layout/page-header';
import { PacksClient } from './packs-client';

const pageInfo = {
  title: 'Packs',
  description: 'Browse packs and find puzzles to solve.',
};

export const metadata: Metadata = {
  title: pageInfo.title,
  description: pageInfo.description,
};

export default function PacksPage() {
  return (
    <Stack gap="md">
      <PageHeader
        title={pageInfo.title}
        description={pageInfo.description}
        align="left"
        testId="packs-header"
      />
      <PacksClient />
    </Stack>
  );
}
