import { act, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/utils/test-utils';
import { PacksClient } from '../packs/packs-client';
import PacksPage from '../packs/page';
import type { NonogramWithProfile, PackWithProfile } from '@/utils/supabase/queries';
import { getNonogramsForPack, getPacks } from '@/utils/supabase/queries';

jest.mock('@/utils/supabase/queries', () => ({
  ...jest.requireActual('@/utils/supabase/queries'),
  getPacks: jest.fn(),
  getNonogramsForPack: jest.fn(),
}));

const mockedGetPacks = getPacks as jest.MockedFunction<typeof getPacks>;
const mockedGetNonogramsForPack = getNonogramsForPack as jest.MockedFunction<
  typeof getNonogramsForPack
>;

const mockPack: PackWithProfile = {
  id: 1,
  name: 'Pack One',
  description: 'A curated set of puzzles',
  user_id: 'user-1',
  created_at: '',
  profiles: { username: 'creator' },
};

const mockNonogram: NonogramWithProfile = {
  id: 11,
  title: 'Sample Puzzle',
  width: 5,
  height: 5,
  solution: '0',
  pack_id: mockPack.id,
  user_id: 'user-1',
  created_at: '',
  profiles: { username: 'creator' },
};

describe('Packs page', () => {
  beforeEach(() => {
    mockedGetPacks.mockReset();
    mockedGetNonogramsForPack.mockReset();
    mockedGetPacks.mockResolvedValue({ data: [], count: 0 });
    mockedGetNonogramsForPack.mockResolvedValue([]);
  });

  describe('given the packs page renders', () => {
    describe('when viewing the layout', () => {
      it('then shows the page header', async () => {
        renderWithProviders(<PacksPage />);
        await act(async () => {});
        await waitFor(() => expect(screen.getByTestId('packs-header')).toBeInTheDocument());
      });
    });
  });

  describe('given packs exist', () => {
    beforeEach(async () => {
      mockedGetPacks.mockResolvedValue({ data: [mockPack], count: 1 });
      mockedGetNonogramsForPack.mockResolvedValue([mockNonogram]);
      await act(async () => {
        renderWithProviders(<PacksClient />);
      });
    });

    describe('when the data loads', () => {
      it('then renders the pack', async () => {
        await waitFor(() => expect(screen.getByTestId('pack-card')).toBeInTheDocument());
      });
    });
  });
});
