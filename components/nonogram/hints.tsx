import { Tables } from "@/types/database.types";
import { NonogramGrid } from "@/types/types";
import { useEffect, useState } from "react";

export function Hints({
  nonogram,
  grid,
  isColumn,
}: {
  nonogram: Tables<"nonograms">;
  grid: NonogramGrid;
  isColumn: boolean;
}) {
  const [hints, setHints] = useState<number[][]>([]);

  useEffect(() => {
    if (!nonogram || !nonogram.solution) return;

    const solutionArray = nonogram.solution.split("").map(Number);
    const length = isColumn ? nonogram.columns : nonogram.rows;
    const newHints = Array.from({ length }, (_, index) => {
      const line = [];
      for (let i = 0; i < (isColumn ? nonogram.rows : nonogram.columns); i++) {
        line.push(
          solutionArray[
            isColumn
              ? i * nonogram.columns + index
              : index * nonogram.columns + i
          ],
        );
      }
      return line
        .join("")
        .split("0")
        .filter((hint) => hint !== "")
        .map((hint) => hint.length);
    });
    setHints(newHints);
  }, [nonogram, isColumn]);

  return (
    <div
      className={`flex items-end flex-nowrap ${!isColumn ? "flex-col" : "flex-row"} h-full select-none`}
    >
      {hints.map((lineHints, index) => (
        <div
          key={index}
          className={`flex ${isColumn ? "flex-col w-8 h-56 rounded-t py-2" : "flex-row h-8 w-56 bg-accent rounded-l px-2"} justify-end items-center bg-accent gap-3 border`}
        >
          {lineHints.map((hint, hintIndex) => (
            <div
              key={hintIndex}
              className="text-center font-bold m-0 p-0 leading-3"
            >
              {hint}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
