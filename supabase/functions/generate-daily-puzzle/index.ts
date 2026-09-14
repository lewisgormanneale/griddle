// Supabase Edge Function: generates today's daily nonogram puzzle and files it
// under a "{Month} {Year} Daily Challenge" pack, creating that pack if needed.
//
// Invoke this on a schedule (see supabase/migrations/*_schedule_daily_puzzle_generation.sql,
// or the Supabase dashboard's Cron integration) so a fresh puzzle appears every day.
// It is idempotent: if a puzzle already exists for the target date it does nothing.
//
// Deno cannot import the app's "@/utils/nonogram/*" modules directly (Next.js path
// aliases + extensionless imports aren't valid Deno specifiers), so the pure
// generation/solving logic below is a deliberate copy of:
//   - utils/nonogram/logic-solver.ts
//   - utils/nonogram/solution.ts
//   - utils/nonogram/generate-daily-puzzle.ts
// Keep this in sync if that logic changes.

import { createClient } from 'jsr:@supabase/supabase-js@2';

const PUZZLE_WIDTH = 15;
const PUZZLE_HEIGHT = 15;
const MAX_GENERATION_ATTEMPTS = 500;

// --- logic-solver.ts (copy) -------------------------------------------------

const UNKNOWN = -1;
const EMPTY = 0;
const FILLED = 1;

const patternCache = new Map<string, number[][]>();

const getPatternKey = (length: number, hints: number[]) => `${length}:${hints.join(',')}`;

const generateLinePatterns = (length: number, hints: number[]) => {
  const key = getPatternKey(length, hints);
  const cached = patternCache.get(key);
  if (cached) {
    return cached;
  }

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
  if (patterns.length === 0) {
    return { updated: false, state: lineState };
  }
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

const isLogicSolvable = ({
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
  const grid = Array.from({ length: height }, () => new Array(width).fill(UNKNOWN));
  let changed = true;

  while (changed) {
    changed = false;

    for (let row = 0; row < height; row += 1) {
      const patterns = generateLinePatterns(width, rows[row] ?? []);
      const filtered = filterPatterns(patterns, grid[row]);
      if (filtered.length === 0) {
        return false;
      }
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
      if (filtered.length === 0) {
        return false;
      }
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

// --- solution.ts (copy) ------------------------------------------------------

const buildHintsFromSolution = (solution: string, width: number, height: number) => {
  const rows: number[][] = [];
  const columns: number[][] = Array.from({ length: width }, () => []);

  for (let row = 0; row < height; row += 1) {
    const rowHints: number[] = [];
    let run = 0;
    for (let col = 0; col < width; col += 1) {
      const value = solution[row * width + col] === '1';
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
      const value = solution[row * width + col] === '1';
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

// --- generate-daily-puzzle.ts (copy) -----------------------------------------

const DENSITY_STEPS = [0.4, 0.45, 0.5, 0.35, 0.55];

const generateRandomSolution = (width: number, height: number, fillRatio: number): string => {
  const cells = new Array<string>(width * height).fill('0');

  for (let row = 0; row < height; row += 1) {
    let col = 0;
    while (col < width) {
      if (Math.random() < fillRatio) {
        const runLength = Math.min(width - col, 1 + Math.floor(Math.random() * 3));
        for (let i = 0; i < runLength; i += 1) {
          cells[row * width + col + i] = '1';
        }
        col += runLength + (Math.random() < 0.5 ? 1 : 0);
      } else {
        col += 1;
      }
    }
  }

  return cells.join('');
};

const hasContent = (rows: number[][]) => rows.some((hints) => hints.length > 0);

const generateSolvablePuzzle = (width: number, height: number, maxAttempts: number) => {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const fillRatio = DENSITY_STEPS[attempt % DENSITY_STEPS.length];
    const solution = generateRandomSolution(width, height, fillRatio);
    const { rows, columns } = buildHintsFromSolution(solution, width, height);

    if (hasContent(rows) && isLogicSolvable({ rows, columns, width, height })) {
      return { solution, rows, columns };
    }
  }

  throw new Error(
    `Failed to generate a logic-solvable ${width}x${height} puzzle after ${maxAttempts} attempts`
  );
};

// --- request handling ---------------------------------------------------------

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const packNameFor = (date: Date) =>
  `${MONTH_NAMES[date.getUTCMonth()]} ${date.getUTCFullYear()} Daily Challenge`;

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

const parseTargetDate = (body: unknown): Date => {
  if (
    body &&
    typeof body === 'object' &&
    'date' in body &&
    typeof (body as { date?: unknown }).date === 'string'
  ) {
    const parsed = new Date(`${(body as { date: string }).date}T00:00:00Z`);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

Deno.serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    let body: unknown = null;
    try {
      body = await req.json();
    } catch {
      // No/invalid JSON body is fine - default to today (UTC).
    }
    const targetDate = parseTargetDate(body);
    const dailyDate = isoDate(targetDate);

    const { data: existing, error: existingError } = await supabase
      .from('nonograms')
      .select('id')
      .eq('daily_date', dailyDate)
      .maybeSingle();

    if (existingError) {
      throw new Error(`Failed to check for existing daily puzzle: ${existingError.message}`);
    }

    if (existing) {
      return Response.json({ alreadyExists: true, nonogramId: existing.id, dailyDate });
    }

    const packName = packNameFor(targetDate);
    const { data: existingPack, error: packLookupError } = await supabase
      .from('packs')
      .select('id')
      .eq('name', packName)
      .maybeSingle();

    if (packLookupError) {
      throw new Error(`Failed to look up daily pack: ${packLookupError.message}`);
    }

    let packId = existingPack?.id;
    if (!packId) {
      const { data: createdPack, error: createPackError } = await supabase
        .from('packs')
        .insert({
          name: packName,
          description: `Daily nonogram puzzles for ${packName.replace(' Daily Challenge', '')}.`,
        })
        .select('id')
        .single();

      if (createPackError || !createdPack) {
        throw new Error(`Failed to create daily pack: ${createPackError?.message}`);
      }
      packId = createdPack.id;
    }

    const puzzle = generateSolvablePuzzle(PUZZLE_WIDTH, PUZZLE_HEIGHT, MAX_GENERATION_ATTEMPTS);

    const formattedTitle = new Date(`${dailyDate}T00:00:00Z`).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });

    const { data: createdNonogram, error: createNonogramError } = await supabase
      .from('nonograms')
      .insert({
        title: `Daily Puzzle - ${formattedTitle}`,
        width: PUZZLE_WIDTH,
        height: PUZZLE_HEIGHT,
        solution: puzzle.solution,
        pack_id: packId,
        daily_date: dailyDate,
      })
      .select('id')
      .single();

    if (createNonogramError || !createdNonogram) {
      throw new Error(`Failed to create daily nonogram: ${createNonogramError?.message}`);
    }

    const rowHints = puzzle.rows.map((hints, index) => ({
      nonogram_id: createdNonogram.id,
      direction: 'row' as const,
      index,
      hints,
    }));
    const columnHints = puzzle.columns.map((hints, index) => ({
      nonogram_id: createdNonogram.id,
      direction: 'column' as const,
      index,
      hints,
    }));

    const { error: hintsError } = await supabase
      .from('nonogram_hints')
      .insert([...rowHints, ...columnHints]);

    if (hintsError) {
      throw new Error(`Failed to save daily puzzle hints: ${hintsError.message}`);
    }

    return Response.json({
      alreadyExists: false,
      nonogramId: createdNonogram.id,
      packId,
      dailyDate,
    });
  } catch (error) {
    console.error('generate-daily-puzzle failed', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
});
