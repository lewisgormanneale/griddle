import {Tables} from "@/types/database.types";
import {CellState} from "@/lib/types";

export function ColumnHints({nonogram, grid}: {
    nonogram: Tables<"nonograms">;
    grid: CellState[][];
}) {
    return null;
}