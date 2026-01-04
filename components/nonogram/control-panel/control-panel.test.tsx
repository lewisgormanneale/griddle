import { act, screen } from '@testing-library/react';
import { ControlPanel } from '@/components/nonogram/control-panel/control-panel';
import { renderWithProviders } from '@/utils/test-utils';

describe('ControlPanel', () => {
  describe('given the timer is running', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      renderWithProviders(<ControlPanel winConditionMet={false} />);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    describe('when time advances', () => {
      it('then displays the elapsed time', () => {
        act(() => {
          jest.advanceTimersByTime(2000);
        });
        expect(screen.getByTestId('nonogram-timer')).toHaveTextContent('00:00:02');
      });
    });
  });

  describe('given an initial completion time', () => {
    describe('when rendering the control panel', () => {
      it('then shows the provided time without running the timer', () => {
        renderWithProviders(<ControlPanel winConditionMet initialTime={90} />);
        expect(screen.getByTestId('nonogram-timer')).toHaveTextContent('00:01:30');
      });
    });
  });
});
