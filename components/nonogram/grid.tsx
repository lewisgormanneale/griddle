import React, { useEffect, useState } from "react";
import { Cell } from "@/components/nonogram/cell";
import { CellState, GridItem, GridItemType } from "@/types/types";
import { Tables } from "@/types/database.types";
import { generateGrid } from "@/utils/nonogram/generate-grid";

export function Grid({
  nonogram,
  winConditionMet,
  onWinConditionMet,
}: {
  nonogram: Tables<"nonograms">;
  winConditionMet: boolean;
  onWinConditionMet: Function;
}) {
  const [grid, setGrid] = useState<GridItem[]>([]);
  const [maxRowClues, setMaxRowClues] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragActionState, setDragActionState] = useState<CellState | null>(
    null,
  );

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  useEffect(() => {
    if (nonogram) {
      const solutionArray = nonogram.solution.split("").map(Number);
      const rows = Array.from({ length: nonogram.rows }, (_, i) =>
        solutionArray.slice(i * nonogram.columns, (i + 1) * nonogram.columns),
      );
      const rowClues = generateClues(rows);
      const colClues = generateClues(transpose(rows));

      setMaxRowClues(Math.max(...rowClues.map((clue) => clue.length)));
      setGrid(generateGrid(rows, rowClues, colClues));
    }
  }, [nonogram]);

  useEffect(() => {
    const validateWinCondition = (currentGrid: GridItem[]) => {
      const playableCells = currentGrid.filter(
        (item) => item.type === GridItemType.Cell,
      );

      if (playableCells.length !== nonogram.rows * nonogram.columns) {
        return;
      }

      const solutionArray = nonogram.solution.split("").map(Number);
      const isWin = playableCells.every((cell, index) => {
        const solutionValue = solutionArray[index];
        if (solutionValue === 1) {
          return cell.cellState === CellState.Filled;
        } else {
          return (
            cell.cellState === CellState.Blank ||
            cell.cellState === CellState.CrossedOut
          );
        }
      });

      if (isWin) {
        setTimeout(() => onWinConditionMet(), 0);
      }
    };

    const playableCells = grid.filter(
      (item) => item.type === GridItemType.Cell,
    );
    if (
      !winConditionMet &&
      playableCells.length === nonogram.rows * nonogram.columns
    ) {
      validateWinCondition(grid);
    }
  }, [grid, nonogram.columns, nonogram.rows, winConditionMet]);

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
      if (count > 0) clues.push(count);
      return clues.length ? clues : [0];
    });
  };

  const transpose = (matrix: number[][]): number[][] => {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  };

  const handleMouseDown = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    setIsMouseDown(true);

    const currentCellState = grid[index].cellState;
    let newFillState: CellState;

    if (event.button === 2) {
      newFillState =
        currentCellState === CellState.Blank
          ? CellState.CrossedOut
          : CellState.Blank;
    } else {
      newFillState =
        currentCellState === CellState.Blank
          ? CellState.Filled
          : CellState.Blank;
    }
    setDragActionState(newFillState);
    updateCellState(index, newFillState);
  };

  const handleMouseEnter = (index: number) => {
    if (isMouseDown && dragActionState !== null) {
      updateCellState(index, dragActionState);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setDragActionState(null);
  };

  const updateCellState = (index: number, newFillState: CellState) => {
    if (!winConditionMet) {
      setGrid((prev) => {
        return prev.map((item, i) =>
          i === index && item.type === "cell"
            ? { ...item, cellState: newFillState }
            : item,
        );
      });
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${maxRowClues}, auto) repeat(${nonogram.columns}, 2rem)`,
      }}
      onMouseDown={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {grid.map((item, index) => (
        <div
          key={index}
          className="w-8 h-8 flex justify-center items-center"
          onMouseDown={(event) =>
            item.type === GridItemType.Cell
              ? handleMouseDown(event, index)
              : undefined
          }
          onMouseEnter={() =>
            item.type === GridItemType.Cell
              ? handleMouseEnter(index)
              : undefined
          }
        >
          {item.type === GridItemType.Clue && item.clueValue}
          {item.type === GridItemType.Cell && (
            <Cell cellState={item.cellState!} />
          )}
        </div>
      ))}
    </div>
  );
}
