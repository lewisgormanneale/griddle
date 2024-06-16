"use client";

import { NonogramGrid } from "@/lib/types";
import { Square } from "./square";
import { useState } from "react";
import { Timer } from "./timer";

interface NonogramProps {
  puzzle: NonogramGrid;
}

export function Game({ puzzle }: NonogramProps) {
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const renderCells = (row: number[], rowIndex: number) => {
    return row.map((cell, cellIndex) => {
      const key = `${rowIndex}-${cellIndex}`;
      const correct = !!cell;
      return <Square key={key} correct={correct} />;
    });
  };

  const renderRows = puzzle.map(renderCells);

  return (
    <div className="flex flex-col items-center gap-2">
      <Timer time={time} timerActive={timerActive} setTime={setTime} />
      <table className="table-fixed">
        <tbody>
          {puzzle.map((row, rowIndex) => {
            return (
              <tr key={rowIndex} className="flex">
                {row.map((cell, cellIndex) => {
                  const key = `${rowIndex}-${cellIndex}`;
                  const correct = !!cell;
                  return <Square key={key} correct={correct} />;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
