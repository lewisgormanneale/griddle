import { IconX } from '@tabler/icons-react';
import { Box } from '@mantine/core';
import { CellState } from '@/types/types';
import classes from './cell.module.css';

export function Cell({ cellState }: { cellState: CellState }) {
  return (
    <Box className={classes.cell} data-state={cellState} data-testid="grid-cell">
      {cellState === CellState.CrossedOut && <IconX className={classes.icon} />}
    </Box>
  );
}
