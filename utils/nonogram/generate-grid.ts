import { CellState, GridItem, GridItemType } from "@/types/types";

export const generateGrid = (
  rows: number[][],
  rowClues: number[][],
  colClues: number[][],
): GridItem[] => {
  const grid: GridItem[] = [];
  const maxRowClues = Math.max(...rowClues.map((clue) => clue.length));
  const maxColClues = Math.max(...colClues.map((clue) => clue.length));

  for (let r = 0; r < maxColClues; r++) {
    for (let c = 0; c < maxRowClues; c++) {
      grid.push({
        type: GridItemType.Empty,
      });
    }
    for (let c = 0; c < rows[0].length; c++) {
      const clueValue = colClues[c][r - (maxColClues - colClues[c].length)];
      grid.push(
        clueValue !== undefined
          ? { type: GridItemType.Clue, clueValue }
          : { type: GridItemType.Empty },
      );
    }
  }

  // Build the grid with row clues and cells
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < maxRowClues; c++) {
      const clueValue = rowClues[r][c - (maxRowClues - rowClues[r].length)];
      grid.push(
        clueValue !== undefined
          ? { type: GridItemType.Clue, clueValue }
          : { type: GridItemType.Empty },
      );
    }
    for (let c = 0; c < rows[r].length; c++) {
      grid.push({
        type: GridItemType.Cell,
        rowIndex: r,
        colIndex: c,
        cellState: CellState.Blank,
      });
    }
  }

  return grid;
};
