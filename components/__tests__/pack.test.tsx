import { act, screen, waitFor } from '@testing-library/react';
import Pack from '@/components/packs/pack';
import {
  type NonogramWithProfile,
  type PackWithProfile,
  getNonogramsForPack,
} from '@/utils/supabase/queries';
import { renderWithProviders } from '@/utils/test-utils';

jest.mock('@/utils/supabase/queries', () => ({
  ...jest.requireActual('@/utils/supabase/queries'),
  getNonogramsForPack: jest.fn(),
}));

const mockedGetNonogramsForPack = getNonogramsForPack as jest.MockedFunction<
  typeof getNonogramsForPack
>;

const pack: PackWithProfile = {
  id: 7,
  name: 'Adventure Pack',
  description: 'A pack for explorers',
  user_id: 'user-1',
  created_at: '',
  profiles: { username: 'mara' },
};

const nonogram: NonogramWithProfile = {
  id: 101,
  title: 'Trail',
  width: 5,
  height: 5,
  solution: '0',
  pack_id: pack.id,
  user_id: 'user-1',
  created_at: '',
  profiles: { username: 'mara' },
};

describe('Pack', () => {
  beforeEach(() => {
    mockedGetNonogramsForPack.mockReset();
  });

  describe('given there are no puzzles yet', () => {
    describe('when the pack loads', () => {
      it('then shows the empty state', async () => {
        mockedGetNonogramsForPack.mockResolvedValue([]);
        await act(async () => {
          renderWithProviders(<Pack pack={pack} />);
        });
        await waitFor(() => expect(screen.getByTestId('pack-empty')).toBeInTheDocument());
      });
    });
  });

  describe('given nonograms exist', () => {
    beforeEach(async () => {
      mockedGetNonogramsForPack.mockResolvedValue([nonogram]);
      await act(async () => {
        renderWithProviders(<Pack pack={pack} />);
      });
    });

    describe('when the data resolves', () => {
      it('then renders the nonogram cards', async () => {
        await waitFor(() => expect(screen.getAllByTestId('pack-nonogram-card')).toHaveLength(1));
      });
    });
  });
});
