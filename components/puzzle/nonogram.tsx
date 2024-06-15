"use client";

import { NonogramGrid } from "@/lib/types";
import { NonogramCell } from "./nonogram-cell";
import { useState } from "react";
import { Timer } from "./timer";

interface NonogramProps {
  puzzle: NonogramGrid;
}

export function NonogramPuzzle({ puzzle }: NonogramProps) {
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const renderCells = (row: number[], rowIndex: number) => {
    return row.map((cell, cellIndex) => {
      const key = `${rowIndex}-${cellIndex}`;
      const correct = !!cell;
      return <NonogramCell key={key} correct={correct} />;
    });
  };

  const renderRows = puzzle.map(renderCells);

  return (
    <div className="flex flex-col items-center gap-2">
      <Timer time={time} timerActive={timerActive} setTime={setTime} />
      <div className="grid grid-cols-5 gap-2">{renderRows}</div>
    </div>
  );
}
