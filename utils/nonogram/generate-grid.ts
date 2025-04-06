import { CellState, GridItem, GridItemType } from "@/types/types";
import { Tables } from "@/types/database.types";

export const generateGrid = (
  nonogram: Tables<"nonograms">,
  rowHints: number[][],
  columnHints: number[][],
): GridItem[] => {
  const grid: GridItem[] = [];
  const { width, height } = nonogram;

  const maxRowHints = Math.max(...rowHints.map((hint) => hint.length));
  const maxColumnHints = Math.max(...columnHints.map((hint) => hint.length));

  for (let r = 0; r < height + maxColumnHints; r++) {
    for (let c = 0; c < width + maxRowHints; c++) {
      if (r < maxColumnHints && c < maxRowHints) {
        grid.push({ type: GridItemType.Empty });
      } else if (r < maxColumnHints) {
        const columnIndex = c - maxRowHints;
        const columnHint = columnHints[columnIndex] || [];
        const hintIndex = r - (maxColumnHints - columnHint.length);
        const hintValue =
          columnIndex >= 0 && hintIndex >= 0
            ? columnHint[hintIndex]
            : undefined;

        grid.push(
          hintValue !== undefined
            ? { type: GridItemType.Clue, hintValue }
            : { type: GridItemType.Empty },
        );
      } else if (c < maxRowHints) {
        const rowIndex = r - maxColumnHints;
        const rowHint = rowHints[rowIndex] || [];
        const hintIndex = c - (maxRowHints - rowHint.length);
        const hintValue =
          rowIndex >= 0 && hintIndex >= 0 ? rowHint[hintIndex] : undefined;

        grid.push(
          hintValue !== undefined
            ? { type: GridItemType.Clue, hintValue }
            : { type: GridItemType.Empty },
        );
      } else {
        const rowIndex = r - maxColumnHints;
        const columnIndex = c - maxRowHints;

        grid.push({
          type: GridItemType.Cell,
          rowIndex,
          colIndex: columnIndex,
          cellState: CellState.Blank,
        });
      }
    }
  }

  return grid;
};
