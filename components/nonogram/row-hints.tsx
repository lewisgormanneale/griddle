import {Tables} from "@/types/database.types";
import {CellState} from "@/lib/types";

export function RowHints({nonogram, grid}: {
    nonogram: Tables<"nonograms">;
    grid: CellState[][];
}) {
    return null;
}