import { isLogicSolvable } from './logic-solver';
import { buildHintsFromSolution } from './solution';

export type GeneratedPuzzle = {
  solution: string;
  rows: number[][];
  columns: number[][];
};

export type GeneratePuzzleOptions = {
  width?: number;
  height?: number;
  maxAttempts?: number;
  random?: () => number;
};

// Deterministic PRNG (mulberry32) so generation can be reproduced/tested with a seed.
export const createSeededRandom = (seed: number): (() => number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// Density is varied across attempts, and cells are filled in short runs rather than
// independently at random - this produces blockier, more nonogram-like shapes that are
// far more likely to be solvable by pure line logic than uniform noise at 15x15.
const DENSITY_STEPS = [0.4, 0.45, 0.5, 0.35, 0.55];

const generateRandomSolution = (
  width: number,
  height: number,
  fillRatio: number,
  random: () => number
): string => {
  const cells = new Array<string>(width * height).fill('0');

  for (let row = 0; row < height; row += 1) {
    let col = 0;
    while (col < width) {
      if (random() < fillRatio) {
        const runLength = Math.min(width - col, 1 + Math.floor(random() * 3));
        for (let i = 0; i < runLength; i += 1) {
          cells[row * width + col + i] = '1';
        }
        col += runLength + (random() < 0.5 ? 1 : 0);
      } else {
        col += 1;
      }
    }
  }

  return cells.join('');
};

const hasContent = (rows: number[][]) => rows.some((hints) => hints.length > 0);

export const generateSolvablePuzzle = ({
  width = 15,
  height = 15,
  maxAttempts = 500,
  random = Math.random,
}: GeneratePuzzleOptions = {}): GeneratedPuzzle => {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const fillRatio = DENSITY_STEPS[attempt % DENSITY_STEPS.length];
    const solution = generateRandomSolution(width, height, fillRatio, random);
    const { rows, columns } = buildHintsFromSolution(solution, width, height);

    if (hasContent(rows) && isLogicSolvable({ rows, columns, width, height })) {
      return { solution, rows, columns };
    }
  }

  throw new Error(
    `Failed to generate a logic-solvable ${width}x${height} puzzle after ${maxAttempts} attempts`
  );
};
