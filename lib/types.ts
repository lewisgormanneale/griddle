export type Puzzle = boolean[][];

export enum CellState {
  Null = "null",
  Blank = "blank",
  Filled = "filled",
  CrossedOut = "crossed-out",
}

export enum InputMode {
  Free = "free",
  Set = "set",
}
