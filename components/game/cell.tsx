import { CellState } from "@/lib/types";
import { LuX } from "react-icons/lu";

export function Cell({
  cellState,
  onMouseDown,
  onMouseEnter,
  onRightClick,
}: {
  cellState: CellState;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onRightClick: (event: React.MouseEvent) => void;
}) {
  return (
    <td
      className={`w-8 h-8 border border-black cursor-pointer nonogram-cell ${
        cellState === CellState.Filled ? "bg-black" : "bg-white"
      }`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onContextMenu={onRightClick}
    >
      {cellState === CellState.CrossedOut ? (
        <div className="flex justify-center items-center">
          <LuX className="text-black" />
        </div>
      ) : null}
    </td>
  );
}
