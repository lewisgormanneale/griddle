import Link from 'next/link';
import { Button, Flex, Text, Title } from '@mantine/core';

export default function Home() {
  return (
    <Flex mih="calc(100vh - 60px)" direction="column" align="center" justify="center">
      <Title className="font-zen-dots uppercase" order={1} ta="center" size={60}>
        Griddle
      </Title>
      <Text ta="center" mb={50} size="xl" c="dimmed">
        Solve logic puzzles by filling in squares according to numbers at the edges of the grid.
      </Text>
      <Flex mb={50} justify="center" direction="column" gap={10}>
        <Link href="/nonogram/4">
          <Button variant="filled" w="100%" size="lg">
            Today's Puzzle
          </Button>
        </Link>
        <Link href="/packs">
          <Button variant="outline" w="100%" size="lg">
            Packs
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
}
