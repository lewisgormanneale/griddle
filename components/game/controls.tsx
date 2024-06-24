import { useState, useEffect } from "react";
import { CellState } from "@/lib/types";
import { LuPencil, LuEraser, LuX } from "react-icons/lu";

export function Controls({
  winConditionMet,
  selectedFillState,
  onSelectedFillState,
}: {
  winConditionMet: boolean;
  selectedFillState: CellState;
  onSelectedFillState: (cellState: CellState) => void;
}) {
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTime((time: number) => time + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerActive, setTime]);

  useEffect(() => {
    if (winConditionMet) {
      setTimerActive(false);
    }
  }, [winConditionMet]);

  return (
    <div className="flex justify-between items-center w-full p-4 rounded bg-orange-400 dark:bg-orange-700">
      <div className="font-serif">Time: {time}s</div>
      <div className="flex items-center">
        <button
          onClick={() => onSelectedFillState(CellState.Filled)}
          className={`px-4 py-1 rounded-l ${
            selectedFillState === CellState.Filled
              ? "bg-zinc-500 text-white"
              : "bg-zinc-50 dark:bg-zinc-700"
          }`}
        >
          <LuPencil className="w-6 h-6" />
        </button>
        <button
          onClick={() => onSelectedFillState(CellState.Blank)}
          className={`px-4 py-1 ${
            selectedFillState === CellState.Blank
              ? "bg-zinc-500 text-white"
              : "bg-zinc-50 dark:bg-zinc-700"
          }`}
        >
          <LuEraser className="w-6 h-6" />
        </button>
        <button
          onClick={() => onSelectedFillState(CellState.CrossedOut)}
          className={`px-4 py-1 rounded-r ${
            selectedFillState === CellState.CrossedOut
              ? "bg-zinc-500 text-white"
              : "bg-zinc-50 dark:bg-zinc-700"
          }`}
        >
          <LuX className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
