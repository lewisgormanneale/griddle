import {CellState} from "@/types/types";
import {LucideX} from "lucide-react";

export function Cell({
                         cellState,
                         onMouseDown,
                         onMouseEnter,
                         onRightClick,
                     }: {
    cellState: CellState;
    onMouseDown: (event: React.MouseEvent) => void;
    onMouseEnter: (event: React.MouseEvent) => void;
    onRightClick: (event: React.MouseEvent) => void;
}) {
    return (
        <td
            className={`w-8 h-8 border border-black cursor-pointer nonogram-cell ${
                cellState === CellState.Filled ? "bg-black" : "bg-zinc-50"
            }`}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onContextMenu={onRightClick}
        >
            {cellState === CellState.CrossedOut ? (
                <div className="flex justify-center items-center">
                    <LucideX className="text-black"/>
                </div>
            ) : null}
        </td>
    );
}
