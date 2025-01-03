import {Tables} from "@/types/database.types";
import {NonogramGrid} from "@/types/types";
import {useEffect, useState} from "react";

export function ColumnHints({nonogram, grid}: {
    nonogram: Tables<"nonograms">;
    grid: NonogramGrid;
}) {
    const [hints, setHints] = useState<number[][]>([]);

    useEffect(() => {
        if (!nonogram || !nonogram.solution) return;

        const solutionArray = nonogram.solution.split("").map(Number);
        const newHints = Array.from({length: nonogram.columns}, (_, colIndex) => {
            const column = [];
            for (let rowIndex = 0; rowIndex < nonogram.rows; rowIndex++) {
                column.push(solutionArray[rowIndex * nonogram.columns + colIndex]);
            }
            return column.join("").split("0").filter(hint => hint !== "").map(hint => hint.length);
        });
        setHints(newHints);
    }, [nonogram]);

    return (
        <div className="flex flex-nowrap items-end h-full">
            {hints.map((columnHints, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-1 w-8 bg-accent rounded-t pt-2 border">
                    {columnHints.map((hint, hintIndex) => (
                        <div key={hintIndex} className="text-center">
                            {hint}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}