import { screen, waitFor } from '@testing-library/react';
import { Leaderboard } from '@/components/nonogram/leaderboard/leaderboard';
import { renderWithProviders } from '@/utils/test-utils';
import { getTopNonogramCompletions } from '@/utils/supabase/queries';

jest.mock('@/utils/supabase/queries', () => ({
  ...jest.requireActual('@/utils/supabase/queries'),
  getTopNonogramCompletions: jest.fn(),
}));

const mockedGetTopNonogramCompletions = getTopNonogramCompletions as jest.MockedFunction<
  typeof getTopNonogramCompletions
>;

const completion = {
  id: 1,
  nonogram_id: 3,
  user_id: 'user-1',
  completion_time: 75,
  profiles: {
    id: 'user-1',
    username: 'sprinter',
    avatar_url: null,
    updated_at: null,
    website: null,
  },
};

describe('Leaderboard', () => {
  beforeEach(() => {
    mockedGetTopNonogramCompletions.mockReset();
  });

  describe('given completion data is returned', () => {
    describe('when the leaderboard loads', () => {
      it('then renders the results table', async () => {
        mockedGetTopNonogramCompletions.mockResolvedValue([completion]);
        renderWithProviders(<Leaderboard nonogram_id={3} />);
        await waitFor(() => expect(screen.getByTestId('leaderboard-table')).toBeInTheDocument());
      });
    });
  });

  describe('given there are no completions', () => {
    describe('when the request finishes', () => {
      it('then shows an empty state', async () => {
        mockedGetTopNonogramCompletions.mockResolvedValue([]);
        renderWithProviders(<Leaderboard nonogram_id={3} />);
        await waitFor(() => expect(screen.getByTestId('leaderboard-empty')).toBeInTheDocument());
      });
    });
  });
});
