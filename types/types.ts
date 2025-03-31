import React from "react";

export type MenuItem = {
  label: string;
  name: string;
  icon: React.ReactNode;
  url: string;
};

export enum CellState {
  Blank = "blank",
  Filled = "filled",
  CrossedOut = "crossed-out",
}

export enum GridItemType {
  Empty = "empty",
  Clue = "clue",
  Cell = "cell",
}

export type GridItem = {
  type: GridItemType;
  rowIndex?: number;
  colIndex?: number;
  clueValue?: number;
  cellState?: CellState;
};
