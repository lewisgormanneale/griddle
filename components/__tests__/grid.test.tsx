import { screen, waitFor } from '@testing-library/react';
import { Grid } from '@/components/nonogram/grid/grid';
import { renderWithProviders } from '@/utils/test-utils';
import type { Tables } from '@/types/database.types';
import { CellState } from '@/types/types';

const baseNonogram: Tables<'nonograms'> = {
  id: 1,
  title: 'Tiny',
  width: 2,
  height: 2,
  solution: '1111',
  pack_id: null,
  user_id: null,
  created_at: null,
};

describe('Grid', () => {
  describe('given a simple nonogram', () => {
    describe('when rendering the grid', () => {
      it('then renders the expected number of cells', async () => {
        renderWithProviders(
          <Grid
            nonogram={baseNonogram}
            rowHints={[[1], [1]]}
            columnHints={[[1], [1]]}
            winConditionMet={false}
            onWinConditionMet={() => {}}
          />
        );

        await waitFor(() => expect(screen.getAllByTestId('grid-cell')).toHaveLength(4));
      });
    });
  });

  describe('given initial cell states', () => {
    describe('when a preset board is provided', () => {
      it('then applies the provided state to the cells', async () => {
        const initialStates = [
          CellState.Filled,
          CellState.CrossedOut,
          CellState.Blank,
          CellState.Blank,
        ];

        renderWithProviders(
          <Grid
            nonogram={baseNonogram}
            rowHints={[[1], [1]]}
            columnHints={[[1], [1]]}
            winConditionMet={false}
            onWinConditionMet={() => {}}
            initialCellStates={initialStates}
          />
        );

        await waitFor(() =>
          expect(screen.getAllByTestId('grid-cell')[0]).toHaveAttribute('data-state', 'filled')
        );
      });
    });
  });
});
