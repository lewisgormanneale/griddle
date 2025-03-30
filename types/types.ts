import React from "react";

export enum InputMode {
  Free = "cursor",
  Set = "touch",
}

export enum CellState {
  Null = "null",
  Blank = "blank",
  Filled = "filled",
  CrossedOut = "crossed-out",
}

export enum NonogramGridItem {
  Empty = "empty",
  Hint = "hint",
  Block = "block",
}

export type NonogramGrid = CellState[][];

export type MenuItem = {
  label: string;
  name: string;
  icon: React.ReactNode;
  url: string;
};

export type GridItem = {
  type: "clue" | "cell" | "empty"; // Types of items
  rowIndex?: number;
  colIndex?: number;
  clueValue?: number;
  cellState?: CellState;
};
