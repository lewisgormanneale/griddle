"use client";

import { CellState, Puzzle } from "@/lib/types";
import { useEffect, useState } from "react";
import { Timer } from "./timer";
import { Clue } from "./clue";
import { Cell } from "./cell";
import { generatePuzzle } from "@/lib/functions";

export function Game() {
  const [puzzle, setPuzzle] = useState([]);
  const [guesses, setGuesses] = useState([]);

  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [winConditionMet, setWinConditionMet] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [rightMouseDown, setRightMouseDown] = useState(false);
  const [firstChangedCellOnDrag, setFirstChangedCellOnDrag] = useState(
    CellState.Null
  );

  useEffect(() => {
    const initialPuzzle = generatePuzzle(5, 5);
    setPuzzle(initialPuzzle);
    setGuesses(initialPuzzle.map((row) => row.map(() => CellState.Blank)));
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsMouseDown(false);
      setRightMouseDown(false);
      setFirstChangedCellOnDrag(CellState.Null);
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  useEffect(() => {
    const checkWinCondition = () => {
      for (let rowIndex = 0; rowIndex < puzzle.length; rowIndex++) {
        for (
          let cellIndex = 0;
          cellIndex < puzzle[rowIndex].length;
          cellIndex++
        ) {
          const puzzleCell = puzzle[rowIndex][cellIndex];
          const guessCell = guesses[rowIndex][cellIndex];
          if (guessCell === CellState.Filled && puzzleCell === false) {
            return false;
          } else if (guessCell === CellState.Blank && puzzleCell === true) {
            return false;
          }
        }
      }
      setWinConditionMet(true);
      setTimerActive(false);
      console.log("YOU WIN!");
    };

    // Optionally, ensure guesses have been made before checking win condition
    if (guesses.some((row) => row.some((cell) => cell !== CellState.Blank))) {
      checkWinCondition();
    }
  }, [guesses, puzzle]);

  const handleMouseDown = (
    event: React.MouseEvent,
    rowIndex: number,
    cellIndex: number
  ) => {
    setIsMouseDown(true);
    if (event.button === 2) {
      setRightMouseDown(true);
      updateGuesses(rowIndex, cellIndex, "right");
    } else {
      updateGuesses(rowIndex, cellIndex, "left");
    }
  };

  const handleMouseEnter = (rowIndex: number, cellIndex: number) => {
    if (isMouseDown && rightMouseDown) {
      updateGuesses(rowIndex, cellIndex, "right");
    } else if (isMouseDown) {
      updateGuesses(rowIndex, cellIndex, "left");
    }
  };

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const updateCellState = (rowIndex, cellIndex, newState) => {
    const updateState = (cell, rIndex, cIndex) => {
      if (rIndex === rowIndex && cIndex === cellIndex) {
        return typeof newState === "function" ? newState(cell) : newState;
      }
      return cell;
    };

    setGuesses(
      guesses.map((row, rIndex) =>
        row.map((cell, cIndex) => updateState(cell, rIndex, cIndex))
      )
    );
  };

  const updateGuesses = (rowIndex, cellIndex, clickMethod) => {
    if (winConditionMet) {
      return;
    }
    if (firstChangedCellOnDrag !== CellState.Null) {
      updateCellState(rowIndex, cellIndex, firstChangedCellOnDrag);
    } else {
      updateCellState(rowIndex, cellIndex, (cell) => {
        if (clickMethod === "left") {
          switch (cell) {
            case CellState.Blank:
            case CellState.CrossedOut:
              setFirstChangedCellOnDrag(CellState.Filled);
              return CellState.Filled;
            case CellState.Filled:
              setFirstChangedCellOnDrag(CellState.Blank);
              return CellState.Blank;
            default:
              return cell;
          }
        } else if (clickMethod === "right") {
          switch (cell) {
            case CellState.Blank:
              setFirstChangedCellOnDrag(CellState.CrossedOut);
              return CellState.CrossedOut;
            case CellState.Filled:
              setFirstChangedCellOnDrag(CellState.CrossedOut);
              return CellState.CrossedOut;
            case CellState.CrossedOut:
              setFirstChangedCellOnDrag(CellState.Blank);
              return CellState.Blank;
            default:
              return cell;
          }
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {puzzle &&
        puzzle.length > 0 &&
        guesses.length > 0 && ( //
          <div>
            <Timer time={time} timerActive={timerActive} setTime={setTime} />
            <table>
              <tbody>
                <tr>
                  <td></td>
                  {puzzle[0].map((_, index) => (
                    <Clue
                      key={index}
                      column={puzzle.map((row) => row[index])}
                    />
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
                            onMouseEnter={() =>
                              handleMouseEnter(rowIndex, cellIndex)
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
          </div>
        )}
    </div>
  );
}
