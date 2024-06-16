"use client";

import { Puzzle } from "@/lib/types";
import { useEffect, useState } from "react";
import { Timer } from "./timer";
import { Clue } from "./clue";
import { Square } from "./square";

interface NonogramProps {
  puzzle: Puzzle;
}

export function Game({ puzzle }: { puzzle: Puzzle }) {
  const [guesses, setGuesses] = useState(
    puzzle.map((row) => row.map(() => false))
  );
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => setIsMouseDown(false);
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleMouseDown = (rowIndex: number, cellIndex: number) => {
    setIsMouseDown(true);
    updateGuesses(rowIndex, cellIndex);
  };

  const handleMouseEnter = (rowIndex: number, cellIndex: number) => {
    if (isMouseDown) {
      updateGuesses(rowIndex, cellIndex);
    }
  };

  const updateGuesses = (rowIndex: number, cellIndex: number) => {
    setGuesses(
      guesses.map((row, rIndex) =>
        row.map((cell, cIndex) =>
          rIndex === rowIndex && cIndex === cellIndex ? !cell : cell
        )
      )
    );
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Timer time={time} timerActive={timerActive} setTime={setTime} />
      <table className="table-fixed border-[1px] border-black">
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
                {row.map((cell, cellIndex) => {
                  const key = `${rowIndex}-${cellIndex}`;
                  const filled = !!cell;
                  return (
                    <Square
                      key={key}
                      filled={guesses[rowIndex][cellIndex]}
                      onMouseDown={() => handleMouseDown(rowIndex, cellIndex)}
                      onMouseEnter={() => handleMouseEnter(rowIndex, cellIndex)}
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
