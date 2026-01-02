import Link from 'next/link';
import { Button, Group, Stack, Text, Title } from '@mantine/core';

export default function Home() {
  return (
    <Stack gap="xl" mt={80} data-testid="home-page">
      <Stack mb={10} data-testid="home-hero">
        <Title
          tt="uppercase"
          mb={20}
          lh={0}
          size={60}
          className="font-zen-dots"
          order={1}
          ta="center"
        >
          Griddle
        </Title>
        <Text ta="center" size="lg" c="dimmed">
          Solve logic puzzles by filling in squares according to numbers at the edges of the grid.
        </Text>
      </Stack>
      <Group justify="center">
        <Link href="/nonogram/3" data-testid="home-todays-puzzle">
          <Button variant="filled" w="100%" size="lg">
            Today's Puzzle
          </Button>
        </Link>
        <Link href="/packs" data-testid="home-packs">
          <Button variant="outline" w="100%" size="lg">
            Packs
          </Button>
        </Link>
      </Group>
    </Stack>
  );
}
