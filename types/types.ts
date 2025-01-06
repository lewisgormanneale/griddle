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

export type NonogramGrid = CellState[][];

export type MenuItem = {
    label: string;
    name: string;
    icon: React.ReactNode;
    url: string;
};
