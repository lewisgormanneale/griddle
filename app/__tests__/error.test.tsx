import { screen } from '@testing-library/react';
import ErrorPage from '../error/page';
import { renderWithProviders } from '@/utils/test-utils';

describe('Error page', () => {
  describe('given an unexpected error occurs', () => {
    describe('when the error page renders', () => {
      it('then shows the error message', () => {
        renderWithProviders(<ErrorPage />);
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
      });
    });
  });
});
