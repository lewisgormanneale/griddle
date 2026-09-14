import { buildHintsFromSolution, createEmptySolution, normalizeSolution } from './solution';

describe('createEmptySolution', () => {
  describe('given a width and height', () => {
    describe('when creating an empty solution', () => {
      it('then returns a string of zeros matching the cell count', () => {
        expect(createEmptySolution(3, 2)).toBe('000000');
      });
    });
  });
});

describe('normalizeSolution', () => {
  describe('given a solution shorter than the grid', () => {
    describe('when normalizing', () => {
      it('then pads the remainder with zeros', () => {
        expect(normalizeSolution('11', 2, 2)).toBe('1100');
      });
    });
  });

  describe('given a solution longer than the grid', () => {
    describe('when normalizing', () => {
      it('then truncates to the grid size', () => {
        expect(normalizeSolution('111111', 2, 2)).toBe('1111');
      });
    });
  });

  describe('given a solution with invalid characters', () => {
    describe('when normalizing', () => {
      it('then replaces them with zeros', () => {
        expect(normalizeSolution('1x1x', 2, 2)).toBe('1010');
      });
    });
  });
});

describe('buildHintsFromSolution', () => {
  describe('given a 3x3 solution with a diagonal filled', () => {
    describe('when building hints', () => {
      const { rows, columns } = buildHintsFromSolution('100010001', 3, 3);

      it('then produces the expected row hints', () => {
        expect(rows).toEqual([[1], [1], [1]]);
      });

      it('then produces the expected column hints', () => {
        expect(columns).toEqual([[1], [1], [1]]);
      });
    });
  });

  describe('given a fully empty solution', () => {
    describe('when building hints', () => {
      it('then every line has no hints', () => {
        const { rows, columns } = buildHintsFromSolution('0000', 2, 2);
        expect([...rows, ...columns]).toEqual([[], [], [], []]);
      });
    });
  });
});
