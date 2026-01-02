import { screen, waitFor } from '@testing-library/react';
import { NonogramClient } from '../nonogram/[id]/nonogram-client';
import type { NonogramWithProfile } from '@/utils/supabase/queries';
import { getUserCompletionOfNonogram, saveNonogramCompletion } from '@/utils/supabase/queries';
import { useAuthUser } from '@/hooks/use-auth-user';
import { renderWithProviders } from '@/utils/test-utils';

jest.mock('@/hooks/use-auth-user');
jest.mock('@/utils/supabase/queries', () => ({
  ...jest.requireActual('@/utils/supabase/queries'),
  getUserCompletionOfNonogram: jest.fn(),
  saveNonogramCompletion: jest.fn(),
  getTopNonogramCompletions: jest.fn().mockResolvedValue([]),
}));

const mockedUseAuthUser = useAuthUser as jest.MockedFunction<typeof useAuthUser>;
const mockedGetCompletion = getUserCompletionOfNonogram as jest.MockedFunction<
  typeof getUserCompletionOfNonogram
>;
const mockedSaveCompletion = saveNonogramCompletion as jest.MockedFunction<
  typeof saveNonogramCompletion
>;

const nonogram: NonogramWithProfile = {
  id: 4,
  title: 'Mini',
  width: 2,
  height: 2,
  solution: '1111',
  pack_id: null,
  user_id: 'user-1',
  created_at: '',
  profiles: null,
};

describe('NonogramClient', () => {
  beforeEach(() => {
    mockedUseAuthUser.mockReset();
    mockedGetCompletion.mockReset();
    mockedSaveCompletion.mockReset();
  });

  describe('given no saved completion', () => {
    describe('when the puzzle loads', () => {
      it('then renders the playable grid', async () => {
        mockedUseAuthUser.mockReturnValue({ user: null, loading: false });
        mockedGetCompletion.mockResolvedValue(null);
        renderWithProviders(
          <NonogramClient nonogram={nonogram} rowHints={[[1], [1]]} columnHints={[[1], [1]]} />
        );

        await waitFor(() => expect(screen.getByTestId('nonogram-grid')).toBeInTheDocument());
      });
    });
  });

  describe('given a saved completion exists', () => {
    describe('when the completion data resolves', () => {
      it('then preloads the completion time', async () => {
        mockedUseAuthUser.mockReturnValue({ user: { id: 'user-1' } as any, loading: false });
        mockedGetCompletion.mockResolvedValue({
          id: 1,
          user_id: 'user-1',
          nonogram_id: nonogram.id,
          completion_time: 45,
        });
        renderWithProviders(
          <NonogramClient nonogram={nonogram} rowHints={[[1], [1]]} columnHints={[[1], [1]]} />
        );

        await waitFor(() =>
          expect(screen.getByTestId('nonogram-timer')).toHaveTextContent('00:00:45')
        );
      });
    });
  });
});
