import React, { useEffect, useState } from "react";
import { Cell } from "@/components/nonogram/cell";
import { CellState, GridItem, GridItemType } from "@/types/types";
import { Tables } from "@/types/database.types";
import { generateGrid } from "@/utils/nonogram/generate-grid";

export function Grid({
  nonogram,
  rowHints,
  columnHints,
  winConditionMet,
  onWinConditionMet,
}: {
  nonogram: Tables<"nonograms">;
  rowHints: number[][];
  columnHints: number[][];
  winConditionMet: boolean;
  onWinConditionMet: Function;
}) {
  const [grid, setGrid] = useState<GridItem[]>([]);
  const [maxRowHints, setMaxRowHints] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragActionState, setDragActionState] = useState<CellState | null>(
    null,
  );

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  useEffect(() => {
    if (nonogram && rowHints.length > 0 && columnHints.length > 0) {
      const solutionArray = nonogram.solution.split("").map(Number);
      const rows = Array.from({ length: nonogram.width }, (_, i) =>
        solutionArray.slice(i * nonogram.height, (i + 1) * nonogram.height),
      );
      setMaxRowHints(Math.max(...rowHints.map((hint) => hint.length)));
      setGrid(generateGrid(rows, rowHints, columnHints));
    }
  }, [nonogram, rowHints, columnHints]);

  useEffect(() => {
    const validateWinCondition = (currentGrid: GridItem[]) => {
      const playableCells = currentGrid.filter(
        (item) => item.type === GridItemType.Cell,
      );

      if (playableCells.length !== nonogram.width * nonogram.height) {
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
      playableCells.length === nonogram.width * nonogram.height
    ) {
      validateWinCondition(grid);
    }
  }, [grid, nonogram.height, nonogram.width, winConditionMet]);

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
        gridTemplateColumns: `repeat(${maxRowHints}, auto) repeat(${nonogram.width}, 2rem)`,
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
