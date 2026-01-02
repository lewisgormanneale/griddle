import { screen } from '@testing-library/react';
import PreferencesPage from '../preferences/page';
import { renderWithProviders } from '@/utils/test-utils';

describe('Preferences page', () => {
  describe('given the page renders', () => {
    describe('when viewing the placeholder', () => {
      it('then shows the placeholder content', () => {
        renderWithProviders(<PreferencesPage />);
        expect(screen.getByTestId('preferences-placeholder')).toBeInTheDocument();
      });
    });
  });
});
