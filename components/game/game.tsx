"use client";

import { Puzzle } from "@/lib/types";
import { Square } from "./square";
import { useState } from "react";
import { Timer } from "./timer";
import { Clue } from "./clue";

interface NonogramProps {
  puzzle: Puzzle;
}

export function Game({ puzzle }: NonogramProps) {
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
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
