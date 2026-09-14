'use client';

import { IconCheck, IconGridDots, IconInfoCircle, IconTargetArrow } from '@tabler/icons-react';
import {
  Card,
  CardSection,
  Group,
  List,
  ListItem,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';

export function HowToPlayInfoCards() {
  return (
    <Group gap="md" grow align="stretch" wrap="wrap">
      <Card withBorder radius="md" padding="md" data-testid="how-to-play-basics">
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
            <ListItem>
              The numbers next to each row and column are your clues. They tell you the lengths of
              consecutive filled blocks on that line.
            </ListItem>
            <ListItem>Blocks are separated by at least one empty cell.</ListItem>
            <ListItem>
              Fill, mark, and narrow down cells in the grid until the puzzle is complete!
            </ListItem>
          </List>
        </CardSection>
      </Card>

      <Card withBorder radius="md" padding="md" data-testid="how-to-play-clues">
        <CardSection withBorder inheritPadding py="sm">
          <Group wrap="nowrap" align="center">
            <ThemeIcon color="amber" variant="light" size={44} radius="md">
              <IconGridDots size={22} />
            </ThemeIcon>
            <Stack flex={1} gap={0}>
              <Title order={4}>Tips & Tricks</Title>
              <Text size="xs" c="dimmed">
                Things to keep in mind when solving nonograms.
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
            <ListItem>
              Guesswork will never be necessary to complete a nonogram - always use logic!
            </ListItem>
            <ListItem>
              Some nonograms may have clues that equal the grid&apos;s length (e.g., &quot;10&quot;
              on a 10-cell line). Look for these straight away to see if you can fill in any rows
              or columns.
            </ListItem>
            <ListItem>
              When starting out, look for large numbers or columns/rows with a lot of blocks.
            </ListItem>
          </List>
        </CardSection>
      </Card>
    </Group>
  );
}
