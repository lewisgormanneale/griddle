import { Game } from "@/components/game/game";
import { generatePuzzle } from "@/lib/functions";

export default function Nonogram() {
  const puzzle = generatePuzzle(10, 10);
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      <Game puzzle={puzzle} />
    </div>
  );
}
