import type { Metadata } from 'next';
import {
  Badge,
  Card,
  Container,
  Group,
  List,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconBook,
  IconBulb,
  IconCheck,
  IconGridDots,
  IconInfoCircle,
  IconTargetArrow,
} from '@tabler/icons-react';
import { PageHeader } from '@/components/layout/page-header';

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

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Card withBorder radius="md" p="lg" data-testid="how-to-play-basics">
            <Group gap="sm" mb="sm">
              <ThemeIcon color="moss" variant="light" size={44} radius="md">
                <IconTargetArrow size={22} />
              </ThemeIcon>
              <div>
                <Title order={3}>The basics</Title>
                <Text size="sm" c="dimmed">
                  Each row and column has number clues.
                </Text>
              </div>
            </Group>
            <List
              spacing="sm"
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
          </Card>

          <Card withBorder radius="md" p="lg" data-testid="how-to-play-clues">
            <Group gap="sm" mb="sm">
              <ThemeIcon color="amber" variant="light" size={44} radius="md">
                <IconGridDots size={22} />
              </ThemeIcon>
              <div>
                <Title order={3}>Reading clues</Title>
                <Text size="sm" c="dimmed">
                  Example: 3 1 means three filled, a gap, then one filled.
                </Text>
              </div>
            </Group>
            <List
              spacing="sm"
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
          </Card>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Card withBorder radius="md" p="lg" data-testid="how-to-play-strategy">
            <Group gap="sm" mb="sm">
              <ThemeIcon color="moss" variant="light" size={44} radius="md">
                <IconBulb size={22} />
              </ThemeIcon>
              <div>
                <Title order={3}>Marking strategy</Title>
                <Text size="sm" c="dimmed">
                  Not sure? Mark empties and move to another line.
                </Text>
              </div>
            </Group>
            <List spacing="sm">
              <ListItem>Cross out cells that cannot belong to any block.</ListItem>
              <ListItem>Alternate between rows and columns to unlock new info.</ListItem>
              <ListItem>Use symmetry and patterns to speed up progress.</ListItem>
            </List>
          </Card>

          <Card withBorder radius="md" p="lg" data-testid="how-to-play-patterns">
            <Group gap="sm" mb="sm">
              <ThemeIcon color="moss" variant="light" size={44} radius="md">
                <IconBook size={22} />
              </ThemeIcon>
              <div>
                <Title order={3}>Common patterns</Title>
                <Text size="sm" c="dimmed">
                  Memorize these and you&apos;ll solve faster.
                </Text>
              </div>
            </Group>
              <Group gap="xs" data-testid="how-to-play-pattern-chips">
              {['1-1-1', '5+ gap', 'edge fill', 'overlap', 'forced gap'].map((pattern) => (
                <Badge key={pattern} variant="light" color="moss">
                  {pattern}
                </Badge>
              ))}
            </Group>
            <Text size="sm" c="dimmed" mt="sm">
              Look for lines where the clues almost fill the entire row or column.
            </Text>
          </Card>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
