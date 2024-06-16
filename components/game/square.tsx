export function Square({
  filled,
  onMouseDown,
  onMouseEnter,
  onRightClick,
}: {
  filled: boolean;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onRightClick: (event: React.MouseEvent) => void;
}) {
  return (
    <td
      className={`w-8 h-8 border-black border-[1px] cursor-pointer ${
        filled ? "bg-black" : "bg-white"
      }`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onContextMenu={onRightClick}
    >
      {filled ? <div className="bg-black"></div> : null}
    </td>
  );
}
