import { useState, useEffect } from "react";
import { CellState, FillMode } from "@/lib/types";
import { Pencil, Eraser, LucideX, Mouse, Pointer } from "lucide-react";
import { Card } from "../ui/card";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export function Controls({
  winConditionMet,
  selectedFillMode,
  selectedFillState,
  onSelectedFillMode,
  onSelectedFillState,
}: {
  winConditionMet: boolean;
  selectedFillMode: FillMode;
  selectedFillState: CellState;
  onSelectedFillMode: (fillMode: FillMode) => void;
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
    <Card className=" w-full">
      <div className="flex justify-between items-center w-full p-4 rounded">
        <div className="font-serif">
          <span className="font-semibold">Time: </span>
          {time}s
        </div>
        <div className="flex">
          <ToggleGroup
            type="single"
            onValueChange={(value: FillMode) => {
              onSelectedFillMode(value);
            }}
            value={selectedFillMode}
            aria-label="Toggle fill mode"
          >
            <ToggleGroupItem value={FillMode.Free} aria-label="Free mode">
              <Mouse className="w-6 h-6" />
            </ToggleGroupItem>
            {selectedFillMode === FillMode.Free && (
              <ToggleGroupItem value={FillMode.Set} aria-label="Set mode">
                <Pointer className="w-6 h-6" />
              </ToggleGroupItem>
            )}
          </ToggleGroup>
          {selectedFillMode === FillMode.Set && (
            <ToggleGroup
              type="single"
              onValueChange={(value: CellState) => {
                onSelectedFillState(value);
              }}
              value={selectedFillState}
              aria-label="Toggle fill state"
            >
              <ToggleGroupItem
                value={CellState.Filled}
                aria-label="Toggle fill"
              >
                <Pencil className="w-6 h-6" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value={CellState.Blank}
                aria-label="Toggle erase"
              >
                <Eraser className="w-6 h-6" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value={CellState.CrossedOut}
                aria-label="Toggle cross"
              >
                <LucideX className="w-6 h-6" />
              </ToggleGroupItem>
            </ToggleGroup>
          )}
        </div>
      </div>
    </Card>
  );
}
