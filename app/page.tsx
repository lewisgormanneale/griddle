import { Nonogram } from "@/ui/nonogram";
import { generatePuzzle } from "@/utils/generatePuzzle";

export default function Home() {
  const puzzle = generatePuzzle(5, 5);
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <Nonogram puzzle={puzzle} />
    </main>
  );
}
