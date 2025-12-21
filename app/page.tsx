import Link from 'next/link';
import { Button } from '@mantine/core';

export default function Home() {
  return (
    <div className="w-full h-[calc(100vh-48px)] flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center text-center gap-8">
        <h2 className="font-zen-dots uppercase text-6xl">Griddle</h2>
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
      </div>
    </div>
  );
}
