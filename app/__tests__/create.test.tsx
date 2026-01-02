import { screen } from '@testing-library/react';
import CreatePage from '../create/page';
import { renderWithProviders } from '@/utils/test-utils';

jest.mock('../create/create-client', () => () => <div data-testid="create-client-mock" />);

describe('Create page', () => {
  describe('given the page loads', () => {
    describe('when viewing the layout', () => {
      it('then renders the header', () => {
        renderWithProviders(<CreatePage />);
        expect(screen.getByTestId('create-header')).toBeInTheDocument();
      });
    });
  });
});
