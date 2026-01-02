'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { IconInfoCircle } from '@tabler/icons-react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Stack,
  Tabs,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Grid } from '@/components/nonogram/grid/grid';
import { useAuthUser } from '@/hooks/use-auth-user';
import { Tables } from '@/types/database.types';
import { CellState, GridItem, GridItemType } from '@/types/types';
import { isLogicSolvable } from '@/utils/nonogram/logic-solver';
import {
  createNonogram,
  createNonogramHints,
  createPack,
  getPacksForUser,
} from '@/utils/supabase/queries';

const createEmptySolution = (width: number, height: number) => '0'.repeat(width * height);

const normalizeSolution = (solution: string, width: number, height: number) => {
  const total = width * height;
  const sanitized = solution.replace(/[^01]/g, '0');
  if (sanitized.length === total) {return sanitized;}
  if (sanitized.length < total) {return sanitized.padEnd(total, '0');}
  return sanitized.slice(0, total);
};

const buildHintsFromSolution = (solution: string, width: number, height: number) => {
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
    if (run > 0) {rowHints.push(run);}
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
    if (run > 0) {columnHints.push(run);}
    columns[col] = columnHints;
  }

  return { rows, columns };
};

const buildSolutionFromGrid = (grid: GridItem[], width: number, height: number) => {
  const playableCells = grid.filter((item) => item.type === GridItemType.Cell);
  if (playableCells.length !== width * height) {return '';}
  return playableCells.map((cell) => (cell.cellState === CellState.Filled ? '1' : '0')).join('');
};

export default function CreateClient() {
  const { user, loading: authLoading } = useAuthUser();
  const [packs, setPacks] = useState<Tables<'packs'>[]>([]);
  const [packsLoading, setPacksLoading] = useState(true);

  const [packName, setPackName] = useState('');
  const [packDescription, setPackDescription] = useState('');
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [creatingPack, setCreatingPack] = useState(false);
  const [showCreatePack, setShowCreatePack] = useState(false);

  const [puzzleTitle, setPuzzleTitle] = useState('');
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);

  const [solution, setSolution] = useState(createEmptySolution(10, 10));
  const [testSolved, setTestSolved] = useState(false);
  const [testRunId, setTestRunId] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [logicStatus, setLogicStatus] = useState<'unknown' | 'pass' | 'fail'>('unknown');

  useEffect(() => {
    if (!user) {
      setPacks([]);
      setPacksLoading(false);
      return;
    }

    setPacksLoading(true);
    getPacksForUser(user.id)
      .then((data) => setPacks(data))
      .finally(() => setPacksLoading(false));
  }, [user]);

  useEffect(() => {
    setSolution(createEmptySolution(width, height));
  }, [width, height]);

  useEffect(() => {
    setTestSolved(false);
    setTestRunId((value) => value + 1);
    setLogicStatus('unknown');
  }, [solution, width, height]);

  const { rows, columns } = useMemo(
    () => buildHintsFromSolution(solution, width, height),
    [solution, width, height]
  );

  const nonogramDraft = useMemo(
    () =>
      ({
        id: 0,
        title: puzzleTitle.trim() || 'Untitled',
        width,
        height,
        solution: normalizeSolution(solution, width, height),
        pack_id: selectedPackId ? Number(selectedPackId) : null,
        created_at: null,
      }) as Tables<'nonograms'>,
    [puzzleTitle, width, height, solution, selectedPackId]
  );

  const handleGridChange = (nextGrid: GridItem[]) => {
    const nextSolution = buildSolutionFromGrid(nextGrid, width, height);
    if (nextSolution && nextSolution !== solution) {
      setSolution(nextSolution);
    }
  };

  const handleCreatePack = async () => {
    if (!user) {
      notifications.show({
        color: 'red',
        title: 'Sign in required',
        message: 'Please sign in before creating a pack.',
      });
      return;
    }

    if (!packName.trim()) {
      notifications.show({
        color: 'red',
        title: 'Pack name required',
        message: 'Add a name before creating a new pack.',
      });
      return;
    }

    setCreatingPack(true);
    const created = await createPack({
      name: packName.trim(),
      description: packDescription.trim() || undefined,
      userId: user.id,
    });

    if (!created) {
      notifications.show({
        color: 'red',
        title: 'Failed to create pack',
        message: 'Please try again in a moment.',
      });
      setCreatingPack(false);
      return;
    }

    setPacks((prev) => [created, ...prev]);
    setSelectedPackId(String(created.id));
    setPackName('');
    setPackDescription('');
    setCreatingPack(false);

    notifications.show({
      color: 'green',
      title: 'Pack created',
      message: 'Your new pack is ready for puzzles.',
    });
  };

  const handlePublish = async () => {
    if (!user) {
      notifications.show({
        color: 'red',
        title: 'Sign in required',
        message: 'Please sign in before publishing.',
      });
      return;
    }

    if (!selectedPackId) {
      notifications.show({
        color: 'red',
        title: 'Pack required',
        message: 'Select or create a pack before publishing.',
      });
      return;
    }

    if (!puzzleTitle.trim()) {
      notifications.show({
        color: 'red',
        title: 'Title required',
        message: 'Give your nonogram a title.',
      });
      return;
    }

    const logicSolvable =
      logicStatus === 'pass' ? true : isLogicSolvable({ rows, columns, width, height });
    setLogicStatus(logicSolvable ? 'pass' : 'fail');
    if (!logicSolvable) {
      notifications.show({
        color: 'red',
        title: 'Logic check failed',
        message: 'Puzzle is not solvable using basic logic alone.',
      });
      return;
    }

    setPublishing(true);
    const createdNonogram = await createNonogram({
      title: puzzleTitle.trim(),
      width,
      height,
      solution: normalizeSolution(solution, width, height),
      packId: Number(selectedPackId),
      userId: user.id,
    });

    if (!createdNonogram) {
      notifications.show({
        color: 'red',
        title: 'Publish failed',
        message: 'Could not save the puzzle. Try again shortly.',
      });
      setPublishing(false);
      return;
    }

    const hintsSaved = await createNonogramHints({
      nonogramId: createdNonogram.id,
      rows,
      columns,
    });

    if (!hintsSaved) {
      notifications.show({
        color: 'red',
        title: 'Hints failed',
        message: 'Puzzle saved, but hints could not be stored.',
      });
      setPublishing(false);
      return;
    }

    notifications.show({
      color: 'green',
      title: 'Published',
      message: 'Your nonogram is now available in the pack.',
    });
    setPublishing(false);
  };

  if (!user && authLoading) {
    return (
      <Group justify="center" pos="relative" h={200}>
        <LoadingOverlay visible />
      </Group>
    );
  }

  if (!user && !authLoading) {
    return (
      <Stack gap="md" maw={560} mx="auto">
        <Alert icon={<IconInfoCircle size={16} />} title="Sign in required" color="gray">
          You need an account to publish packs and puzzles.
        </Alert>
        <Group justify="center">
          <Button component={Link} href="/auth/login?next=/create">
            Sign in
          </Button>
        </Group>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Card withBorder radius="md" p="lg">
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <div>
              <Text fw={600}>Pack</Text>
              <Text size="sm" c="dimmed">
                Select an existing pack or create a new one.
              </Text>
            </div>
          </Group>

          <Select
            label="Existing pack"
            placeholder={packsLoading ? 'Loading packs...' : 'Pick a pack'}
            data={packs.map((pack) => ({
              value: String(pack.id),
              label: pack.name ?? `Pack ${pack.id}`,
            }))}
            value={selectedPackId}
            onChange={setSelectedPackId}
            disabled={packsLoading}
          />

          {packs.length === 0 && !packsLoading && (
            <Text size="sm" c="dimmed">
              You do not have any packs yet. Create a pack to publish puzzles.
            </Text>
          )}

          <Group justify="space-between" align="center">
            <Button
              variant={showCreatePack ? 'light' : 'outline'}
              onClick={() => setShowCreatePack((value) => !value)}
            >
              {showCreatePack ? 'Hide pack form' : 'Create new pack'}
            </Button>
          </Group>

          {showCreatePack && (
            <>
              <Divider label="New pack details" labelPosition="center" />
              <TextInput
                label="Pack name"
                placeholder="Nature escapes"
                value={packName}
                onChange={(event) => setPackName(event.currentTarget.value)}
              />
              <Textarea
                label="Description"
                placeholder="Short theme or story for the pack"
                minRows={2}
                value={packDescription}
                onChange={(event) => setPackDescription(event.currentTarget.value)}
              />
              <Group justify="flex-end">
                <Button variant="light" onClick={handleCreatePack} loading={creatingPack}>
                  Create pack
                </Button>
              </Group>
            </>
          )}
        </Stack>
      </Card>

      <Card withBorder radius="md" p="lg">
        <Stack gap="md">
          <Text fw={600}>Puzzle details</Text>
          <TextInput
            label="Title"
            placeholder="Misty mountain"
            value={puzzleTitle}
            onChange={(event) => setPuzzleTitle(event.currentTarget.value)}
          />
          <Group grow>
            <NumberInput
              label="Width"
              min={5}
              max={20}
              step={5}
              value={width}
              onChange={(value) => setWidth(Number(value) || 5)}
            />
            <NumberInput
              label="Height"
              min={5}
              max={20}
              step={5}
              value={height}
              onChange={(value) => setHeight(Number(value) || 5)}
            />
          </Group>
        </Stack>
      </Card>

      <Card withBorder radius="md" p="lg">
        <Tabs defaultValue="edit" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="edit">Edit</Tabs.Tab>
            <Tabs.Tab value="test">Test</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="edit" pt="md">
            <Stack gap="md">
              <Text size="sm" c="dimmed">
                Draw your solution. Hints update as you go.
              </Text>
              <Group justify="space-between" align="center">
                <Text size="sm" c="dimmed">
                  Run a logic check before publishing.
                </Text>
                <Button
                  variant="light"
                  onClick={() => {
                    const logicSolvable = isLogicSolvable({ rows, columns, width, height });
                    setLogicStatus(logicSolvable ? 'pass' : 'fail');
                  }}
                >
                  Run logic check
                </Button>
              </Group>
              <Group justify="center">
                <Grid
                  nonogram={nonogramDraft}
                  rowHints={rows}
                  columnHints={columns}
                  winConditionMet={false}
                  onWinConditionMet={() => {}}
                  mode="edit"
                  onGridChange={handleGridChange}
                />
              </Group>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="test" pt="md">
            <Stack gap="md">
              <Alert icon={<IconInfoCircle size={16} />} title="Optional test run" color="gray">
                Try the puzzle if you want a feel for how difficult it is. Publishing depends on the
                logic check instead.
              </Alert>
              <Group justify="center" pos="relative">
                <LoadingOverlay visible={rows.length === 0 || columns.length === 0} />
                <Grid
                  key={testRunId}
                  nonogram={nonogramDraft}
                  rowHints={rows}
                  columnHints={columns}
                  winConditionMet={testSolved}
                  onWinConditionMet={() => setTestSolved(true)}
                />
              </Group>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Card>

      <Group justify="space-between" align="center">
        <Badge color={logicStatus === 'pass' ? 'green' : logicStatus === 'fail' ? 'red' : 'gray'}>
          {logicStatus === 'pass'
            ? 'Logic check passed'
            : logicStatus === 'fail'
              ? 'Logic check failed'
              : 'Logic check not run'}
        </Badge>
        <Button onClick={handlePublish} loading={publishing}>
          Publish
        </Button>
      </Group>
    </Stack>
  );
}
