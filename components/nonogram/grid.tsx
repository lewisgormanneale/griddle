import React, { useEffect, useState } from "react";
import { Cell } from "@/components/nonogram/cell";
import { CellState, InputMode, NonogramGrid } from "@/types/types";

export function Grid({
  grid,
  winConditionMet,
  selectedInputMode,
  selectedFillState,
  onGridChange,
  onSelectedFillState,
}: {
  grid: NonogramGrid;
  winConditionMet: boolean;
  selectedInputMode: InputMode;
  selectedFillState: CellState;
  onSelectedFillState: (cellState: CellState) => void;
  onGridChange: (newGrid: NonogramGrid) => void;
}) {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = (
    event: React.MouseEvent,
    rowIndex: number,
    cellIndex: number,
  ) => {
    setIsMouseDown(true);
    let newFillState = selectedFillState;
    if (selectedInputMode === InputMode.Free) {
      const currentCellState = grid[rowIndex][cellIndex];
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
      onSelectedFillState(newFillState);
    }
    updateCellState(rowIndex, cellIndex, newFillState);
  };

  const handleMouseEnter = (rowIndex: number, cellIndex: number) => {
    if (isMouseDown) {
      updateCellState(rowIndex, cellIndex, selectedFillState);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const updateCellState = (
    rowIndex: number,
    cellIndex: number,
    newFillState: CellState,
  ) => {
    if (!winConditionMet) {
      const newGrid = grid.map((row, i) =>
        i === rowIndex
          ? row.map((cell, j) => (j === cellIndex ? newFillState : cell))
          : row,
      );
      handleGridChange(newGrid);
    }
  };

  const handleGridChange = (newGrid: NonogramGrid) => {
    onGridChange(newGrid);
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  if (!grid || grid.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="select-none flex flex-wrap"
      style={{
        width: `${grid[0].length * 2}rem`,
        height: `${grid.length * 2}rem`,
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, cellIndex) => (
          <Cell
            key={`${rowIndex}-${cellIndex}`}
            cellState={grid[rowIndex][cellIndex]}
            onMouseDown={(event: React.MouseEvent) =>
              handleMouseDown(event, rowIndex, cellIndex)
            }
            onMouseEnter={() => handleMouseEnter(rowIndex, cellIndex)}
            onRightClick={(event: React.MouseEvent) => handleRightClick(event)}
          />
        )),
      )}
    </div>
  );
}
