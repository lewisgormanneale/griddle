import { createSeededRandom, generateSolvablePuzzle } from './generate-daily-puzzle';
import { isLogicSolvable } from './logic-solver';

describe('generateSolvablePuzzle', () => {
  describe('given a seeded random source', () => {
    describe('when generating a 15x15 puzzle', () => {
      const puzzle = generateSolvablePuzzle({ random: createSeededRandom(42) });

      it('then the solution length matches the grid size', () => {
        expect(puzzle.solution).toHaveLength(225);
      });

      it('then the solution only contains 0s and 1s', () => {
        expect(puzzle.solution).toMatch(/^[01]+$/);
      });

      it('then the puzzle is solvable using logic alone', () => {
        expect(
          isLogicSolvable({
            rows: puzzle.rows,
            columns: puzzle.columns,
            width: 15,
            height: 15,
          })
        ).toBe(true);
      });
    });
  });

  describe('given the same seed used twice', () => {
    describe('when generating two puzzles', () => {
      it('then the puzzles are identical', () => {
        const first = generateSolvablePuzzle({ random: createSeededRandom(7) });
        const second = generateSolvablePuzzle({ random: createSeededRandom(7) });
        expect(first.solution).toBe(second.solution);
      });
    });
  });

  describe('given a custom width and height', () => {
    describe('when generating a puzzle', () => {
      it('then the solution matches the requested cell count', () => {
        const puzzle = generateSolvablePuzzle({
          width: 10,
          height: 8,
          random: createSeededRandom(1),
        });
        expect(puzzle.solution).toHaveLength(80);
      });
    });
  });

  describe('given generation cannot find a solvable puzzle in time', () => {
    describe('when attempts are exhausted', () => {
      it('then throws an error', () => {
        expect(() =>
          generateSolvablePuzzle({ maxAttempts: 0, random: createSeededRandom(1) })
        ).toThrow();
      });
    });
  });
});
