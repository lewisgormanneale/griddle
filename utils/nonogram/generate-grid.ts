import { CellState, GridItem } from "@/types/types";

export const generateGrid = (
  rows: number[][],
  rowClues: number[][],
  colClues: number[][],
): GridItem[] => {
  const grid: GridItem[] = [];
  const maxRowClues = Math.max(...rowClues.map((clue) => clue.length));
  const maxColClues = Math.max(...colClues.map((clue) => clue.length));

  // Build the top-left empty cells (where rows and columns meet)
  for (let r = 0; r < maxColClues; r++) {
    for (let c = 0; c < maxRowClues; c++) {
      grid.push({ type: "empty" }); // No clues in this section
    }
    for (let c = 0; c < rows[0].length; c++) {
      const clueValue = colClues[c][r - (maxColClues - colClues[c].length)];
      grid.push(
        clueValue !== undefined
          ? { type: "clue", clueValue }
          : { type: "empty" },
      );
    }
  }

  // Build the grid with row clues and cells
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < maxRowClues; c++) {
      const clueValue = rowClues[r][c - (maxRowClues - rowClues[r].length)];
      grid.push(
        clueValue !== undefined
          ? { type: "clue", clueValue }
          : { type: "empty" },
      );
    }
    for (let c = 0; c < rows[r].length; c++) {
      grid.push({
        type: "cell",
        rowIndex: r,
        colIndex: c,
        cellState: CellState.Blank,
      });
    }
  }

  return grid;
};
