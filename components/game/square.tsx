import { useState } from "react";

export function Square({
  filled,
  onClick,
}: {
  filled: boolean;
  onClick: () => void;
}) {
  const handleClick = () => {
    onClick();
  };

  return (
    <td
      className={`w-8 h-8 border-black border-[1px] cursor-pointer ${
        filled ? "bg-black" : "bg-white"
      }`}
      onClick={handleClick}
    >
      {filled ? <div className="bg-black"></div> : null}
    </td>
  );
}
