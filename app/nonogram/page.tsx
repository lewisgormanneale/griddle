import { Game } from "@/components/game/game";
import { generatePuzzle } from "@/lib/functions";

export default function Nonogram() {
  const puzzle = generatePuzzle(5, 5);
  return (
    <main className="flex flex-col justify-center items-center min-h-screen p-4">
      <Game puzzle={puzzle} />
    </main>
  );
}
