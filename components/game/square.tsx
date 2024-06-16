import { useState } from "react";

export function Square({ correct }: { correct: boolean }) {
  const [filled, setFilled] = useState(false);

  const handleClick = () => {
    setFilled(!filled);
  };

  return (
    <td
      className={`w-8 h-8 border-black border-[1px] cursor-pointer ${
        filled ? "bg-black" : "bg-white"
      }`}
      onClick={handleClick}
    >
      {correct ? <div className="bg-black"></div> : null}
    </td>
  );
}
