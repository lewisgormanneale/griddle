import { useState, useEffect } from "react";
import { CellState } from "@/lib/types";
import { Pencil, Eraser, LucideX } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Toggle } from "../ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

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
    <Card className="bg-primary-foreground w-full">
      <div className="flex justify-between items-center w-full p-4 rounded">
        <div className="font-serif">Time: {time}s</div>
        <ToggleGroup type="single">
          <ToggleGroupItem
            value="fill"
            onClick={() => onSelectedFillState(CellState.Filled)}
            aria-label="Toggle fill"
          >
            <Pencil className="w-6 h-6" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="erase"
            aria-label="Toggle erase"
            onClick={() => onSelectedFillState(CellState.Blank)}
          >
            <Eraser className="w-6 h-6" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="cross"
            aria-label="Toggle cross"
            onClick={() => onSelectedFillState(CellState.CrossedOut)}
          >
            <LucideX className="w-6 h-6" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </Card>
  );
}
