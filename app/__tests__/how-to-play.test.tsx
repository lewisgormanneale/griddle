import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/utils/test-utils';
import HowToPlayPage from '../how-to-play/page';

describe('How to play page', () => {
  describe('given that the page loads', () => {
    beforeEach(() => {
      renderWithProviders(<HowToPlayPage />);
    });

    describe('when viewing the page content', () => {
      it('then shows the main title', () => {
        expect(screen.getByTestId('how-to-play-header')).toBeInTheDocument();
      });

      it('then shows the basics section', () => {
        expect(screen.getByTestId('how-to-play-basics')).toBeInTheDocument();
      });

      it('then shows the reading clues section', () => {
        expect(screen.getByTestId('how-to-play-clues')).toBeInTheDocument();
      });

      it('then shows the marking strategy section', () => {
        expect(screen.getByTestId('how-to-play-strategy')).toBeInTheDocument();
      });

      it('then shows the common patterns section', () => {
        expect(screen.getByTestId('how-to-play-patterns')).toBeInTheDocument();
      });

      it('then shows a sample pattern chip', () => {
        expect(screen.getByTestId('how-to-play-pattern-chips')).toBeInTheDocument();
      });
    });
  });
});
