import React, { useEffect, useState } from "react";
import { Cell } from "@/components/nonogram/cell";
import { CellState, InputMode } from "@/types/types";
import { Tables } from "@/types/database.types";
import { generateGrid } from "@/utils/nonogram/generate-grid";

type GridItem = {
  type: "clue" | "cell" | "empty"; // Types of items
  rowIndex?: number;
  colIndex?: number;
  clueValue?: number;
  cellState?: CellState;
};

export function Grid({
  nonogram,
  winConditionMet,
  selectedInputMode,
  selectedFillState,
  onSelectedFillState,
}: {
  nonogram: Tables<"nonograms">;
  winConditionMet: boolean;
  selectedInputMode: InputMode;
  selectedFillState: CellState;
  onSelectedFillState: (cellState: CellState) => void;
}) {
  const [grid, setGrid] = useState<GridItem[]>([]);
  const [maxRowClues, setMaxRowClues] = useState(0);
  const [maxColClues, setMaxColClues] = useState(0);

  const [isMouseDown, setIsMouseDown] = useState(false);

  // Populate the grid and calculate row/column clues on mount

  useEffect(() => {
    if (nonogram) {
      const solutionArray = nonogram.solution.split("").map(Number);

      const rows = Array.from({ length: nonogram.rows }, (_, i) =>
        solutionArray.slice(i * nonogram.columns, (i + 1) * nonogram.columns),
      );

      const rowClues = generateClues(rows);
      const colClues = generateClues(transpose(rows));

      setMaxRowClues(Math.max(...rowClues.map((clue) => clue.length)));
      setMaxColClues(Math.max(...colClues.map((clue) => clue.length)));

      // Generate the flat grid
      setGrid(generateGrid(rows, rowClues, colClues));
    }
  }, [nonogram]);

  // Helper to generate clues (groupings of 1s)
  const generateClues = (lines: number[][]): number[][] => {
    return lines.map((line) => {
      const clues: number[] = [];
      let count = 0;
      line.forEach((cell) => {
        if (cell === 1) {
          count++;
        } else if (count > 0) {
          clues.push(count);
          count = 0;
        }
      });
      if (count > 0) clues.push(count); // Push any remaining count
      return clues.length ? clues : [0]; // Return [0] for empty rows/columns
    });
  };

  const transpose = (matrix: number[][]): number[][] => {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  };

  const handleMouseDown = (index: number) => {
    setIsMouseDown(true);
    updateCellState(index, selectedFillState);
    onSelectedFillState(selectedFillState); // Update the parent component if needed
  };

  const handleMouseEnter = (index: number) => {
    if (isMouseDown) {
      updateCellState(index, selectedFillState);
    }
  };

  const handleMouseUp = () => setIsMouseDown(false);

  const updateCellState = (index: number, newFillState: CellState) => {
    if (!winConditionMet) {
      setGrid((prev) =>
        prev.map((item, i) =>
          i === index && item.type === "cell"
            ? { ...item, cellState: newFillState }
            : item,
        ),
      );
    }
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  if (!grid.length) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${maxRowClues}, auto) repeat(${nonogram.columns}, 2rem)`,
      }}
    >
      {grid.map((item, index) => (
        <div
          key={index}
          className="w-8 h-8 flex justify-center items-center"
          onMouseDown={() =>
            item.type === "cell" ? handleMouseDown(index) : undefined
          }
          onMouseEnter={() =>
            item.type === "cell" ? handleMouseEnter(index) : undefined
          }
        >
          {item.type === "clue" && item.clueValue}
          {item.type === "cell" && <Cell cellState={item.cellState!} />}
        </div>
      ))}
    </div>
  );
}
