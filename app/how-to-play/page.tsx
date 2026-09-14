import type { Metadata } from 'next';
import { Container, Stack } from '@mantine/core';
import { PageHeader } from '@/components/layout/page-header';
import { HowToPlayInfoCards } from './how-to-play-info-cards';
import { HowToPlayTutorial } from './how-to-play-tutorial';

const pageInfo = {
  title: 'How to Play',
  description: 'A quick guide to nonograms, also known as picross or griddlers.',
};

export const metadata: Metadata = {
  title: pageInfo.title,
  description: pageInfo.description,
};

export default function HowToPlayPage() {
  return (
    <Container size="md">
      <Stack gap="md">
        <PageHeader
          title={pageInfo.title}
          description={pageInfo.description}
          align="left"
          testId="how-to-play-header"
        />

        <HowToPlayInfoCards />

        <HowToPlayTutorial data-testid="how-to-play-tutorial" />
      </Stack>
    </Container>
  );
}
