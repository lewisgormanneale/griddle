import { useEffect, useState } from "react";
import { CellState, InputMode } from "@/types/types";
import { Eraser, LucideX, Pencil } from "lucide-react";
import { Card } from "../ui/card";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Tables } from "@/types/database.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Timer } from "@/components/nonogram/timer";

export function ControlPanel({
  nonogram,
  winConditionMet,
  selectedInputMode,
  selectedFillState,
  onSelectedInputMode,
  onSelectedFillState,
}: {
  nonogram: Tables<"nonograms">;
  winConditionMet: boolean;
  selectedInputMode: InputMode;
  selectedFillState: CellState;
  onSelectedInputMode: (inputMode: InputMode) => void;
  onSelectedFillState: (cellState: CellState) => void;
}) {
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    if (winConditionMet) {
      setTimerActive(false);
    }
  }, [winConditionMet]);

  return (
    <Card className="w-full flex justify-between items-center gap-3 p-3">
      <div className="flex items-center gap-3">
        <Timer time={time} setTime={setTime} timerActive={timerActive} />
      </div>
      <div className="flex items-center gap-3">
        <Select
          value={selectedInputMode}
          onValueChange={(value: InputMode) => {
            onSelectedInputMode(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cursor">Cursor</SelectItem>
            <SelectItem value="touch">Touch</SelectItem>
          </SelectContent>
        </Select>
        {selectedInputMode === "touch" && (
          <ToggleGroup
            type="single"
            disabled={!(selectedInputMode === "touch")}
            onValueChange={(value: CellState) => {
              onSelectedFillState(value);
            }}
            value={selectedFillState}
            aria-label="Toggle fill state"
          >
            <ToggleGroupItem value={CellState.Filled} aria-label="Toggle fill">
              <Pencil className="w-6 h-6" />
            </ToggleGroupItem>
            <ToggleGroupItem value={CellState.Blank} aria-label="Toggle erase">
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
    </Card>
  );
}
