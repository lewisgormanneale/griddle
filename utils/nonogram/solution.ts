export const createEmptySolution = (width: number, height: number) => '0'.repeat(width * height);

export const normalizeSolution = (solution: string, width: number, height: number) => {
  const total = width * height;
  const sanitized = solution.replace(/[^01]/g, '0');
  if (sanitized.length === total) {
    return sanitized;
  }
  if (sanitized.length < total) {
    return sanitized.padEnd(total, '0');
  }
  return sanitized.slice(0, total);
};

export const buildHintsFromSolution = (solution: string, width: number, height: number) => {
  const normalized = normalizeSolution(solution, width, height);
  const rows: number[][] = [];
  const columns: number[][] = Array.from({ length: width }, () => []);

  for (let row = 0; row < height; row += 1) {
    const rowHints: number[] = [];
    let run = 0;
    for (let col = 0; col < width; col += 1) {
      const value = normalized[row * width + col] === '1';
      if (value) {
        run += 1;
      } else if (run > 0) {
        rowHints.push(run);
        run = 0;
      }
    }
    if (run > 0) {
      rowHints.push(run);
    }
    rows.push(rowHints);
  }

  for (let col = 0; col < width; col += 1) {
    const columnHints: number[] = [];
    let run = 0;
    for (let row = 0; row < height; row += 1) {
      const value = normalized[row * width + col] === '1';
      if (value) {
        run += 1;
      } else if (run > 0) {
        columnHints.push(run);
        run = 0;
      }
    }
    if (run > 0) {
      columnHints.push(run);
    }
    columns[col] = columnHints;
  }

  return { rows, columns };
};
