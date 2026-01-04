import { screen } from '@testing-library/react';
import { PageHeader } from '@/components/layout/page-header';
import { renderWithProviders } from '@/utils/test-utils';

describe('PageHeader', () => {
  describe('given a title and description', () => {
    beforeEach(() => {
      renderWithProviders(
        <PageHeader title="Test title" description="Test description" testId="page-header" />
      );
    });

    describe('when rendering the header', () => {
      it('then exposes the provided test id', () => {
        expect(screen.getByTestId('page-header')).toBeInTheDocument();
      });
    });
  });
});
