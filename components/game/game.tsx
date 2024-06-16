"use client";

import { CellState, Puzzle } from "@/lib/types";
import { useEffect, useState } from "react";
import { Timer } from "./timer";
import { Clue } from "./clue";
import { Cell } from "./cell";

export function Game({ puzzle }: { puzzle: Puzzle }) {
  const [guesses, setGuesses] = useState(
    puzzle.map((row) => row.map(() => CellState.Blank))
  );
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [rightMouseDown, setRightMouseDown] = useState(false);
  const [firstChangedCellOnDrag, setFirstChangedCellOnDrag] = useState(
    CellState.Null
  );

  useEffect(() => {
    const handleMouseUp = () => {
      setIsMouseDown(false);
      setRightMouseDown(false);
      setFirstChangedCellOnDrag(CellState.Null);
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
    if (event.button === 2) {
      setRightMouseDown(true);
      updateGuessesWithRightClick(rowIndex, cellIndex);
    } else {
      updateGuessesWithLeftClick(rowIndex, cellIndex);
    }
  };

  const handleMouseEnter = (rowIndex: number, cellIndex: number) => {
    if (isMouseDown && rightMouseDown) {
      updateGuessesWithRightClick(rowIndex, cellIndex);
    } else if (isMouseDown) {
      updateGuessesWithLeftClick(rowIndex, cellIndex);
    }
  };

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const updateGuessesWithLeftClick = (rowIndex: number, cellIndex: number) => {
    if (firstChangedCellOnDrag !== CellState.Null) {
      setGuesses(
        guesses.map((row, rIndex) =>
          row.map((cell, cIndex) => {
            if (rIndex === rowIndex && cIndex === cellIndex) {
              return firstChangedCellOnDrag;
            } else {
              return cell;
            }
          })
        )
      );
      return;
    } else {
      setGuesses(
        guesses.map((row, rIndex) =>
          row.map((cell, cIndex) => {
            if (rIndex === rowIndex && cIndex === cellIndex) {
              switch (cell) {
                case CellState.Blank:
                  setFirstChangedCellOnDrag(CellState.Filled);
                  return CellState.Filled;
                case CellState.CrossedOut:
                  setFirstChangedCellOnDrag(CellState.Filled);
                  return CellState.Filled;
                case CellState.Filled:
                  setFirstChangedCellOnDrag(CellState.Blank);
                  return CellState.Blank;
                default:
                  return cell;
              }
            } else {
              return cell;
            }
          })
        )
      );
    }
  };

  const updateGuessesWithRightClick = (rowIndex: number, cellIndex: number) => {
    if (firstChangedCellOnDrag !== CellState.Null) {
      setGuesses(
        guesses.map((row, rIndex) =>
          row.map((cell, cIndex) => {
            if (rIndex === rowIndex && cIndex === cellIndex) {
              return firstChangedCellOnDrag;
            } else {
              return cell;
            }
          })
        )
      );
      return;
    } else {
      setGuesses(
        guesses.map((row, rIndex) =>
          row.map((cell, cIndex) => {
            if (rIndex === rowIndex && cIndex === cellIndex) {
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
            } else {
              return cell;
            }
          })
        )
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <Timer time={time} timerActive={timerActive} setTime={setTime} />
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
                      onMouseEnter={() => handleMouseEnter(rowIndex, cellIndex)}
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
  );
}
