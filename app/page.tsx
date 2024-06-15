import { Nonogram } from "@/components/nonogram/nonogram";
import { Welcome } from "@/components/welcome/welcome";
import { generatePuzzle } from "@/lib/functions";

export default function Home() {
  const puzzle = generatePuzzle(5, 5);
  return (
    <main className="flex flex-col justify-center items-center min-h-screen p-4 bg-orange-500">
      <Welcome />
      <Nonogram puzzle={puzzle} />
    </main>
  );
}
