import type { Metadata } from 'next';
import { Stack } from '@mantine/core';
import { PageHeader } from '@/components/layout/page-header';
import CreateClient from './create-client';

const pageInfo = {
  title: 'Create',
  description: 'Build a pack, craft a puzzle, then test and publish.',
};

export const metadata: Metadata = {
  title: pageInfo.title,
  description: pageInfo.description,
};

export default function Page() {
  return (
    <Stack gap="lg">
      <PageHeader
        title={pageInfo.title}
        description={pageInfo.description}
        align="left"
        testId="create-header"
      />
      <CreateClient />
    </Stack>
  );
}
