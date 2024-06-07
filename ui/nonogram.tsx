import { NonogramGrid } from "@/lib/nonograms";
import { NonogramCell } from "./nonogram-cell";

interface NonogramProps {
  puzzle: NonogramGrid;
}

export function Nonogram({ puzzle }: NonogramProps) {
  const renderCells = (row: number[], rowIndex: number) => {
    return row.map((cell, cellIndex) => {
      const key = `${rowIndex}-${cellIndex}`;
      const correct = !!cell;
      return <NonogramCell key={key} correct={correct} />;
    });
  };

  const renderRows = puzzle.map(renderCells);

  return <div className="grid grid-cols-5 gap-2">{renderRows}</div>;
}
