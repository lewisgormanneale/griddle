import { CellState } from "@/types/types";
import { IconX } from "@tabler/icons-react";

export function Cell({ cellState }: { cellState: CellState }) {
  return (
    <div
      className={`w-full h-full border border-black cursor-pointer ${
        cellState === CellState.Filled ? "bg-black" : "bg-zinc-50"
      }`}
    >
      {cellState === CellState.CrossedOut ? (
        <div className="flex justify-center items-center">
          <IconX className="text-black w-full h-full" />
        </div>
      ) : null}
    </div>
  );
}
