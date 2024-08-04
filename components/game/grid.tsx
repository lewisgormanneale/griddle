"use client";

import { CellState, Puzzle, InputMode } from "@/lib/types";
import { useEffect, useState } from "react";
import { Timer } from "./timer";
import { Clue } from "./clue";
import { Cell } from "./cell";

export function Grid({
  puzzle,
  selectedInputMode,
  selectedFillState,
  winConditionMet,
  onSelectedFillState,
  onWin,
  onError,
}: {
  puzzle: Puzzle;
  selectedInputMode: InputMode;
  selectedFillState: CellState;
  winConditionMet: boolean;
  onSelectedFillState: (cellState: CellState) => void;
  onWin: () => void;
  onError: () => void;
}) {
  const [guesses, setGuesses] = useState<CellState[][]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    setGuesses(puzzle.map((row) => row.map(() => CellState.Blank)));
  }, [puzzle]);

  useEffect(() => {
    const guessesMade = guesses.some((row) =>
      row.some((cell) => cell !== CellState.Blank)
    );

    if (guessesMade) {
      const hasWon = puzzle.every((row, rowIndex) =>
        row.every(
          (cell, cellIndex) =>
            (cell && guesses[rowIndex][cellIndex] === CellState.Filled) ||
            (!cell &&
              (guesses[rowIndex][cellIndex] === CellState.Blank ||
                guesses[rowIndex][cellIndex] === CellState.CrossedOut))
        )
      );

      if (hasWon) {
        onWin();
      }
    }
  }, [guesses, puzzle, onWin]);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsMouseDown(false);
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleMouseDown = (
    event: React.MouseEvent,
    rowIndex: number,
    cellIndex: number
  ) => {
    setIsMouseDown(true);
    let newFillState = selectedFillState;

    if (selectedInputMode === InputMode.Free) {
      const currentCellState = guesses[rowIndex][cellIndex];
      if (event.button === 2) {
        newFillState =
          currentCellState === CellState.Filled
            ? CellState.CrossedOut
            : CellState.CrossedOut;
      } else {
        newFillState =
          currentCellState === CellState.Filled
            ? CellState.Blank
            : CellState.Filled;
      }
      onSelectedFillState(newFillState);
    }
    updateCellState(rowIndex, cellIndex, newFillState);
  };

  const handleMouseEnter = (
    event: React.MouseEvent,
    rowIndex: number,
    cellIndex: number
  ) => {
    if (isMouseDown) {
      updateCellState(rowIndex, cellIndex);
    }
  };

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const updateCellState = (
    rowIndex: number,
    cellIndex: number,
    newFillState?: FillState
  ) => {
    if (!winConditionMet) {
      setGuesses((prevGuesses) =>
        prevGuesses.map((row, i) =>
          i === rowIndex
            ? [
                ...row.slice(0, cellIndex),
                newFillState || selectedFillState,
                ...row.slice(cellIndex + 1),
              ]
            : row
        )
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {guesses && guesses.length > 0 && (
        <table>
          <tbody>
            <tr>
              <td></td>
              {puzzle[0].map((_, index) => (
                <Clue key={index} column={puzzle.map((row) => row[index])} />
              ))}
            </tr>
            {puzzle.map((row, rowIndex) => {
              return (
                <tr key={rowIndex}>
                  <Clue key={rowIndex} row={row} />
                  {row.map((_, cellIndex) => {
                    return (
                      <Cell
                        key={`${rowIndex}-${cellIndex}`}
                        cellState={guesses[rowIndex][cellIndex]}
                        onMouseDown={(event: React.MouseEvent) =>
                          handleMouseDown(event, rowIndex, cellIndex)
                        }
                        onMouseEnter={(event: React.MouseEvent) =>
                          handleMouseEnter(event, rowIndex, cellIndex)
                        }
                        onRightClick={(event: React.MouseEvent) =>
                          handleRightClick(event)
                        }
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
