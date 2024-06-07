import { Nonogram } from "@/ui/nonogram";
import { generatePuzzle } from "@/utils/generatePuzzle";

export default function Home() {
  const puzzle = generatePuzzle(5, 5);
  return (
    <main className="flex flex-col justify-center items-center min-h-screen p-4 bg-orange-500">
      <Nonogram puzzle={puzzle} />
    </main>
  );
}
