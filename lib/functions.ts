import { Puzzle } from "@/lib/types";

export function generatePuzzle(rows: number, cols: number): Puzzle {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() > 0.5)
  );
}
