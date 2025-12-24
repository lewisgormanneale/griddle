const UNKNOWN = -1;
const EMPTY = 0;
const FILLED = 1;

const patternCache = new Map<string, number[][]>();

const getPatternKey = (length: number, hints: number[]) =>
  `${length}:${hints.join(",")}`;

const generateLinePatterns = (length: number, hints: number[]) => {
  const key = getPatternKey(length, hints);
  const cached = patternCache.get(key);
  if (cached) return cached;

  if (hints.length === 0) {
    const blank = new Array(length).fill(EMPTY);
    patternCache.set(key, [blank]);
    return [blank];
  }

  const results: number[][] = [];
  const remainingMins = new Array(hints.length + 1).fill(0);

  for (let i = hints.length - 1; i >= 0; i -= 1) {
    const remainingHintSum = remainingMins[i + 1] + hints[i];
    const remainingGaps = hints.length - i - 1;
    remainingMins[i] = remainingHintSum + remainingGaps;
  }

  const build = (hintIndex: number, position: number, line: number[]) => {
    if (hintIndex >= hints.length) {
      const completed = line.slice();
      for (let i = position; i < length; i += 1) {
        completed[i] = EMPTY;
      }
      results.push(completed);
      return;
    }

    const hintSize = hints[hintIndex];
    const remainingMin = remainingMins[hintIndex + 1];
    const maxStart = length - hintSize - remainingMin;

    for (let start = position; start <= maxStart; start += 1) {
      const nextLine = line.slice();

      for (let i = position; i < start; i += 1) {
        nextLine[i] = EMPTY;
      }
      for (let i = start; i < start + hintSize; i += 1) {
        nextLine[i] = FILLED;
      }

      const nextPosition = start + hintSize + 1;
      if (hintIndex === hints.length - 1) {
        for (let i = start + hintSize; i < length; i += 1) {
          nextLine[i] = EMPTY;
        }
        results.push(nextLine);
      } else {
        nextLine[start + hintSize] = EMPTY;
        build(hintIndex + 1, nextPosition, nextLine);
      }
    }
  };

  build(0, 0, new Array(length).fill(EMPTY));
  patternCache.set(key, results);
  return results;
};

const filterPatterns = (patterns: number[][], lineState: number[]) =>
  patterns.filter((pattern) =>
    pattern.every((value, index) => lineState[index] === UNKNOWN || lineState[index] === value)
  );

const applyForcedCells = (patterns: number[][], lineState: number[]) => {
  if (patterns.length === 0) return { updated: false, state: lineState };
  const length = lineState.length;
  const nextState = lineState.slice();
  let updated = false;

  for (let i = 0; i < length; i += 1) {
    const value = patterns[0][i];
    const forced = patterns.every((pattern) => pattern[i] === value);
    if (forced && nextState[i] !== value) {
      nextState[i] = value;
      updated = true;
    }
  }

  return { updated, state: nextState };
};

export const isLogicSolvable = ({
  rows,
  columns,
  width,
  height,
}: {
  rows: number[][];
  columns: number[][];
  width: number;
  height: number;
}) => {
  let grid = Array.from({ length: height }, () => new Array(width).fill(UNKNOWN));
  let changed = true;

  while (changed) {
    changed = false;

    for (let row = 0; row < height; row += 1) {
      const patterns = generateLinePatterns(width, rows[row] ?? []);
      const filtered = filterPatterns(patterns, grid[row]);
      if (filtered.length === 0) return false;
      const result = applyForcedCells(filtered, grid[row]);
      if (result.updated) {
        grid[row] = result.state;
        changed = true;
      }
    }

    for (let col = 0; col < width; col += 1) {
      const columnState = grid.map((row) => row[col]);
      const patterns = generateLinePatterns(height, columns[col] ?? []);
      const filtered = filterPatterns(patterns, columnState);
      if (filtered.length === 0) return false;
      const result = applyForcedCells(filtered, columnState);
      if (result.updated) {
        for (let row = 0; row < height; row += 1) {
          grid[row][col] = result.state[row];
        }
        changed = true;
      }
    }
  }

  return grid.every((row) => row.every((cell) => cell !== UNKNOWN));
};
