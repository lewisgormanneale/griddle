import { CellState } from "@/lib/types";
import { LuX } from "react-icons/lu";

export function Cell({
  cellState,
  onMouseDown,
  onMouseEnter,
  onRightClick,
}: {
  cellState: CellState;
  onMouseDown: (event: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onRightClick: (event: React.MouseEvent) => void;
}) {
  return (
    <td
      className={`w-8 h-8 border-black border-[1px] cursor-pointer ${
        cellState === CellState.Filled ? "bg-black" : "bg-white"
      }`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onContextMenu={onRightClick}
    >
      {cellState === CellState.CrossedOut ? (
        <div className="flex justify-center items-center">
          <LuX />
        </div>
      ) : null}
    </td>
  );
}
