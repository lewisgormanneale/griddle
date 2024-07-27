export type Puzzle = boolean[][];

export enum CellState {
  Null,
  Blank,
  Filled,
  CrossedOut,
}

export enum FillMode {
  Free = "free",
  Set = "set",
}
