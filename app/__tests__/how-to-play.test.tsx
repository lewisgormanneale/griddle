import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/utils/test-utils';
import HowToPlayPage from '../how-to-play/page';

describe('How to play page', () => {
  describe('given that the page loads', () => {
    beforeEach(() => {
      renderWithProviders(<HowToPlayPage />);
    });

    describe('when viewing the page content', () => {
      it('then shows the basics section', () => {
        expect(screen.getByTestId('how-to-play-basics')).toBeInTheDocument();
      });

      it('then shows the reading clues section', () => {
        expect(screen.getByTestId('how-to-play-clues')).toBeInTheDocument();
      });

      it('then shows the mini tutorial', () => {
        expect(screen.getByTestId('how-to-play-tutorial')).toBeInTheDocument();
      });
    });
  });
});
