import Link from 'next/link';
import { Button, Flex, Title } from '@mantine/core';

export default function Home() {
  return (
    <Flex m="lg" direction="column">
      <Title className="font-zen-dots uppercase" order={1} ta="center" mt={100} size={60}>
        Griddle
      </Title>
      <p className="font-serif text-2xl">
        Solve logic puzzles by filling in squares according to numbers at the edges of the grid.
      </p>
      <div className="flex gap-3 flex-col">
        <Link href="/nonogram/4">
          <Button variant="default">Today's Puzzle</Button>
        </Link>
        <Link href="/packs">
          <Button variant="outline">Packs</Button>
        </Link>
      </div>
    </Flex>
  );
}
