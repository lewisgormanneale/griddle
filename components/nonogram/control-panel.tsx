import {useEffect, useState} from "react";
import {CellState, InputMode} from "@/types/types";
import {Eraser, LucideX, Pencil} from "lucide-react";
import {Card} from "../ui/card";
import {ToggleGroup, ToggleGroupItem} from "../ui/toggle-group";
import {Tables} from "@/types/database.types";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

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
        <Card className="w-full">
            <div className="flex flex-col justify-between items-center w-full p-4 rounded">
                <div className="font-serif">
                    <span className="font-semibold">Status: </span>
                    {winConditionMet ? "You win!" : "In progress"}
                </div>
                <div className="font-serif">
                    <span className="font-semibold">Time: </span>
                    {time}s
                </div>
                <div className="flex flex-col gap-3">
                    <Select
                        value={selectedInputMode}
                        onValueChange={(value: InputMode) => {
                            onSelectedInputMode(value);
                        }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cursor">Cursor</SelectItem>
                            <SelectItem value="touch">Touch</SelectItem>
                        </SelectContent>
                    </Select>
                    {selectedInputMode === 'touch' &&
                        <div className="ml-4">
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
                                    <Pencil className="w-6 h-6"/>
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value={CellState.Blank}
                                    aria-label="Toggle erase"
                                >
                                    <Eraser className="w-6 h-6"/>
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value={CellState.CrossedOut}
                                    aria-label="Toggle cross"
                                >
                                    <LucideX className="w-6 h-6"/>
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                    }
                </div>
            </div>
        </Card>
    );
}
