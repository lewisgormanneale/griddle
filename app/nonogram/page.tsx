import { NonogramPuzzle } from "@/components/puzzle/nonogram";
import { generatePuzzle } from "@/lib/functions";

export default function Nonogram() {
  const puzzle = generatePuzzle(5, 5);
  return (
    <main className="flex flex-col justify-center items-center min-h-screen p-4 bg-orange-500">
      <NonogramPuzzle puzzle={puzzle} />
    </main>
  );
}
