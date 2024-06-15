import { useState } from "react";

export function NonogramCell({ correct }: { correct: boolean }) {
  const [filled, setFilled] = useState(false);

  const handleClick = () => {
    setFilled(!filled);
  };

  return (
    <div
      className={`w-6 h-6 cursor-pointer ${filled ? "bg-black" : "bg-white"}`}
      onClick={handleClick}
    >
      {correct ? <div className="bg-black"></div> : null}
    </div>
  );
}
