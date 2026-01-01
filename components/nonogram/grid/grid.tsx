import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@mantine/core';
import { Cell } from '@/components/nonogram/grid/cell';
import { Tables } from '@/types/database.types';
import { CellState, GridItem, GridItemType } from '@/types/types';
import { generateGrid } from '@/utils/nonogram/generate-grid';
import classes from './grid.module.css';

export function Grid({
  nonogram,
  rowHints,
  columnHints,
  mode = 'play',
  winConditionMet,
  onWinConditionMet,
  onGridChange,
  interactive = true,
  initialCellStates,
}: {
  nonogram: Tables<'nonograms'>;
  rowHints: number[][];
  columnHints: number[][];
  mode?: 'play' | 'edit';
  winConditionMet: boolean;
  onWinConditionMet: () => void;
  onGridChange?: (grid: GridItem[]) => void;
  interactive?: boolean;
  initialCellStates?: CellState[];
}) {
  const [grid, setGrid] = useState<GridItem[]>([]);
  const [maxRowHints, setMaxRowHints] = useState(0);
  const [maxColumnHints, setMaxColumnHints] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragActionState, setDragActionState] = useState<CellState | null>(null);
  const hasNotifiedRef = useRef(false);
  const suppressNotifyRef = useRef(false);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    setDragActionState(null);
  }, []);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  useEffect(() => {
    if (!nonogram || rowHints.length === 0 || columnHints.length === 0) {
      return;
    }
    const dynamicMaxRow = Math.max(...rowHints.map((hint) => hint.length));
    const dynamicMaxColumn = Math.max(...columnHints.map((hint) => hint.length));
    const fixedMaxRow = Math.ceil(nonogram.width / 2);
    const fixedMaxColumn = Math.ceil(nonogram.height / 2);
    setMaxRowHints(mode === 'edit' ? fixedMaxRow : dynamicMaxRow);
    setMaxColumnHints(mode === 'edit' ? fixedMaxColumn : dynamicMaxColumn);
  }, [nonogram, rowHints, columnHints, mode]);

  useEffect(() => {
    if (!nonogram || rowHints.length === 0 || columnHints.length === 0) {
      return;
    }

    suppressNotifyRef.current = true;
    const nextGrid = generateGrid(nonogram, rowHints, columnHints, {
        useSolution: mode === 'edit',
        maxRowHints,
        maxColumnHints,
      });

    if (initialCellStates && initialCellStates.length === nonogram.width * nonogram.height) {
      setGrid(
        nextGrid.map((item) => {
          if (item.type !== GridItemType.Cell) return item;
          const cellIndex = (item.rowIndex ?? 0) * nonogram.width + (item.colIndex ?? 0);
          const overrideState = initialCellStates[cellIndex];
          return overrideState !== undefined ? { ...item, cellState: overrideState } : item;
        })
      );
      return;
    }

    setGrid(nextGrid);
  }, [nonogram, rowHints, columnHints, mode, maxRowHints, maxColumnHints, initialCellStates]);

  useEffect(() => {
    if (mode === 'edit') {
      return;
    }

    const validateWinCondition = (currentGrid: GridItem[]) => {
      const playableCells = currentGrid.filter((item) => item.type === GridItemType.Cell);

      if (playableCells.length !== nonogram.width * nonogram.height) {
        return;
      }

      const solutionArray = nonogram.solution.split('').map(Number);
      const isWin = playableCells.every((cell, index) => {
        const solutionValue = solutionArray[index];
        if (solutionValue === 1) {
          return cell.cellState === CellState.Filled;
        }
        return cell.cellState === CellState.Blank || cell.cellState === CellState.CrossedOut;
      });

      if (isWin) {
        setTimeout(() => onWinConditionMet(), 0);
      }
    };

    const playableCells = grid.filter((item) => item.type === GridItemType.Cell);
    if (!winConditionMet && playableCells.length === nonogram.width * nonogram.height) {
      validateWinCondition(grid);
    }
  }, [grid, nonogram.height, nonogram.width, winConditionMet, mode, onWinConditionMet]);

  useEffect(() => {
    if (!onGridChange || mode !== 'edit') {
      return;
    }
    if (!hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      return;
    }
    if (suppressNotifyRef.current) {
      suppressNotifyRef.current = false;
      return;
    }
    onGridChange(grid);
  }, [grid, mode, onGridChange]);

  const handleMouseDown = (event: React.MouseEvent, index: number) => {
    if (!interactive) {
      return;
    }
    event.preventDefault();
    setIsMouseDown(true);

    const currentCellState = grid[index].cellState;
    let newFillState: CellState;

    if (mode === 'edit') {
      newFillState = currentCellState === CellState.Filled ? CellState.Blank : CellState.Filled;
    } else if (event.button === 2) {
      newFillState = currentCellState === CellState.Blank ? CellState.CrossedOut : CellState.Blank;
    } else {
      newFillState = currentCellState === CellState.Blank ? CellState.Filled : CellState.Blank;
    }
    setDragActionState(newFillState);
    updateCellState(index, newFillState);
  };

  const handleMouseEnter = (index: number) => {
    if (!interactive) {
      return;
    }
    if (isMouseDown && dragActionState !== null) {
      updateCellState(index, dragActionState);
    }
  };

  const updateCellState = (index: number, newFillState: CellState) => {
    if (!winConditionMet) {
      setGrid((prev) => {
        return prev.map((item, i) =>
          i === index && item.type === 'cell' ? { ...item, cellState: newFillState } : item
        );
      });
    }
  };

  return (
    <Box
      className={classes.grid}
      style={{
        gridTemplateColumns:
          maxRowHints > 0
            ? `repeat(${maxRowHints}, auto) repeat(${nonogram.width}, 1.5rem)`
            : `repeat(${nonogram.width}, 1.5rem)`,
      }}
      onMouseDown={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {grid.map((item, index) => {
        const columnCount = nonogram.width + maxRowHints;
        const gridRow = Math.floor(index / columnCount);
        const gridColumn = index % columnCount;
        const cellRowIndex = item.rowIndex ?? gridRow - maxColumnHints;
        const cellColIndex = item.colIndex ?? gridColumn - maxRowHints;
        const isCell = item.type === GridItemType.Cell;
        const isLastRow = cellRowIndex === nonogram.height - 1;
        const isLastColumn = cellColIndex === nonogram.width - 1;

        const borderStyle = isCell
          ? {
              borderTop: cellRowIndex % 5 === 0 ? '3px solid black' : '1px solid black',
              borderLeft: cellColIndex % 5 === 0 ? '3px solid black' : '1px solid black',
              borderBottom: isLastRow ? '3px solid black' : '1px solid black',
              borderRight: isLastColumn ? '3px solid black' : '1px solid black',
            }
          : undefined;

        return (
          <Box
            key={index}
            className={`${classes.gridItem} ${isCell ? classes.cell : ''} ${
              isCell && !interactive ? classes.cellReadonly : ''
            }`}
            style={borderStyle}
            onMouseDown={
              isCell && interactive ? (event) => handleMouseDown(event, index) : undefined
            }
            onMouseEnter={isCell && interactive ? () => handleMouseEnter(index) : undefined}
          >
            {item.type === GridItemType.Clue && item.hintValue}
            {isCell && <Cell cellState={item.cellState!} />}
          </Box>
        );
      })}
    </Box>
  );
}
