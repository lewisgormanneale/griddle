import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/utils/test-utils';
import Home from '../page';

describe('Home page', () => {
  describe('given the home page renders', () => {
    beforeEach(() => {
      renderWithProviders(<Home />);
    });

    describe('when viewing the hero section', () => {
      it('then shows the CTA buttons', () => {
        expect(screen.getByTestId('home-todays-puzzle')).toBeInTheDocument();
      });

      it('then shows the packs link', () => {
        expect(screen.getByTestId('home-packs')).toBeInTheDocument();
      });
    });
  });
});
