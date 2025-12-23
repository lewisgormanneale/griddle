import React, { useEffect, useState } from 'react';
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
  winConditionMet,
  onWinConditionMet,
}: {
  nonogram: Tables<'nonograms'>;
  rowHints: number[][];
  columnHints: number[][];
  winConditionMet: boolean;
  onWinConditionMet: Function;
}) {
  const [grid, setGrid] = useState<GridItem[]>([]);
  const [maxRowHints, setMaxRowHints] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragActionState, setDragActionState] = useState<CellState | null>(null);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  useEffect(() => {
    if (nonogram && rowHints.length > 0 && columnHints.length > 0) {
      setMaxRowHints(Math.max(...rowHints.map((hint) => hint.length)));
      setGrid(generateGrid(nonogram, rowHints, columnHints));
    }
  }, [nonogram, rowHints, columnHints]);

  useEffect(() => {
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
        } else {
          return cell.cellState === CellState.Blank || cell.cellState === CellState.CrossedOut;
        }
      });

      if (isWin) {
        setTimeout(() => onWinConditionMet(), 0);
      }
    };

    const playableCells = grid.filter((item) => item.type === GridItemType.Cell);
    if (!winConditionMet && playableCells.length === nonogram.width * nonogram.height) {
      validateWinCondition(grid);
    }
  }, [grid, nonogram.height, nonogram.width, winConditionMet]);

  const handleMouseDown = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    setIsMouseDown(true);

    const currentCellState = grid[index].cellState;
    let newFillState: CellState;

    if (event.button === 2) {
      newFillState = currentCellState === CellState.Blank ? CellState.CrossedOut : CellState.Blank;
    } else {
      newFillState = currentCellState === CellState.Blank ? CellState.Filled : CellState.Blank;
    }
    setDragActionState(newFillState);
    updateCellState(index, newFillState);
  };

  const handleMouseEnter = (index: number) => {
    if (isMouseDown && dragActionState !== null) {
      updateCellState(index, dragActionState);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setDragActionState(null);
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
        gridTemplateColumns: `repeat(${maxRowHints}, auto) repeat(${nonogram.width}, 1.5rem)`,
      }}
      onMouseDown={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {grid.map((item, index) => {
        const isCell = item.type === GridItemType.Cell;
        const isLastRow = item.rowIndex === nonogram.height - 1;
        const isLastColumn = item.colIndex === nonogram.width - 1;

        const borderStyle = isCell
          ? {
              borderTop: item.rowIndex! % 5 === 0 ? '2px solid black' : '1px solid black',
              borderLeft: item.colIndex! % 5 === 0 ? '2px solid black' : '1px solid black',
              borderBottom: isLastRow ? '2px solid black' : '1px solid black',
              borderRight: isLastColumn ? '2px solid black' : '1px solid black',
            }
          : undefined;

        return (
          <Box
            key={index}
            className={`${classes.gridItem} ${isCell ? classes.cell : ''}`}
            style={borderStyle}
            onMouseDown={isCell ? (event) => handleMouseDown(event, index) : undefined}
            onMouseEnter={isCell ? () => handleMouseEnter(index) : undefined}
          >
            {item.type === GridItemType.Clue && item.hintValue}
            {isCell && <Cell cellState={item.cellState!} />}
          </Box>
        );
      })}
    </Box>
  );
}
