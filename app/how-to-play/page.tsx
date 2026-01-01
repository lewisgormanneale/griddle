import type { Metadata } from 'next';
import { IconCheck, IconGridDots, IconInfoCircle, IconTargetArrow } from '@tabler/icons-react';
import {
  Card,
  CardSection,
  Container,
  Group,
  List,
  ListItem,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { PageHeader } from '@/components/layout/page-header';
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
    <Container size="lg">
      <Stack gap="xl">
        <PageHeader
          title={pageInfo.title}
          description={pageInfo.description}
          align="left"
          data-testid="how-to-play-header"
        />

        <Group gap="lg" grow align="stretch" wrap="wrap">
          <Card withBorder radius="md" data-testid="how-to-play-basics">
            <CardSection withBorder inheritPadding py="sm">
              <Group gap="sm" wrap="nowrap" align="center">
                <ThemeIcon color="moss" variant="light" size={44} radius="md">
                  <IconTargetArrow size={22} />
                </ThemeIcon>
                <Stack flex={1} gap={0}>
                  <Title order={4}>The Basics</Title>
                  <Text size="xs" c="dimmed">
                    Each row and column has number clues.
                  </Text>
                </Stack>
              </Group>
            </CardSection>
            <CardSection inheritPadding py="md">
              <List
                spacing="sm"
                size="sm"
                icon={
                  <ThemeIcon color="moss" variant="light" size={22} radius="xl">
                    <IconCheck size={14} />
                  </ThemeIcon>
                }
              >
                <ListItem>Numbers tell you the lengths of consecutive filled blocks.</ListItem>
                <ListItem>Blocks are separated by at least one empty cell.</ListItem>
                <ListItem>Fill, mark, and narrow down until the picture appears.</ListItem>
              </List>
            </CardSection>
          </Card>

          <Card withBorder radius="md" data-testid="how-to-play-clues">
            <CardSection withBorder inheritPadding py="sm">
              <Group wrap="nowrap" align="center">
                <ThemeIcon color="amber" variant="light" size={44} radius="md">
                  <IconGridDots size={22} />
                </ThemeIcon>
                <Stack flex={1} gap={0}>
                  <Title order={4}>Reading Clues</Title>
                  <Text size="xs" c="dimmed">
                    Clues represent filled cells in that line.
                  </Text>
                </Stack>
              </Group>
            </CardSection>
            <CardSection inheritPadding py="md">
              <List
                spacing="sm"
                size="sm"
                icon={
                  <ThemeIcon color="amber" variant="light" size={22} radius="xl">
                    <IconInfoCircle size={14} />
                  </ThemeIcon>
                }
              >
                <ListItem>Sum of the numbers plus minimum gaps must fit the line.</ListItem>
                <ListItem>Big numbers often anchor the earliest moves.</ListItem>
                <ListItem>Use overlaps to find guaranteed filled cells.</ListItem>
              </List>
            </CardSection>
          </Card>
        </Group>

        <HowToPlayTutorial />
      </Stack>
    </Container>
  );
}
