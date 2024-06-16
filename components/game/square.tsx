export function Square({
  filled,
  onMouseDown,
  onMouseEnter,
}: {
  filled: boolean;
  onMouseDown: () => void;
  onMouseEnter: () => void;
}) {
  return (
    <td
      className={`w-8 h-8 border-black border-[1px] cursor-pointer ${
        filled ? "bg-black" : "bg-white"
      }`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    >
      {filled ? <div className="bg-black"></div> : null}
    </td>
  );
}
