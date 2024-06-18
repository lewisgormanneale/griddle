import { Game } from "@/components/game/game";
import { generatePuzzle } from "@/lib/functions";

export default function Nonogram() {
  const puzzle = generatePuzzle(2, 2);
  return (
    <div className="flex flex-col items-center p-4 mt-8">
      <Game puzzle={puzzle} />
    </div>
  );
}
