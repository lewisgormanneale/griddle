'use client';

import { Carousel, CarouselSlide } from '@mantine/carousel';
import { Card, CardSection, Group, Stack, Text, Title } from '@mantine/core';
import { Grid } from '@/components/nonogram/grid/grid';
import type { Tables } from '@/types/database.types';
import { CellState } from '@/types/types';

type TutorialStep = {
  id: string;
  title: string;
  description: string;
  cellStates: CellState[];
};

const tutorialNonogram: Tables<'nonograms'> = {
  id: 0,
  title: 'Tutorial',
  width: 5,
  height: 5,
  solution: '0111010001110000101100',
  pack_id: null,
  user_id: null,
  created_at: null,
};

const rowHints = [[3], [1, 1], [3], [1], [2]];
const columnHints = [[2], [1, 1, 1], [1, 3], [1], [1]];

const makeEmpty = () => Array.from({ length: 25 }, () => CellState.Blank);

const steps: TutorialStep[] = (() => {
  const grid = makeEmpty();
  const stepsLocal: TutorialStep[] = [];

  const addFilled = (indices: number[]) => indices.forEach((i) => (grid[i] = CellState.Filled));
  const addCrosses = (indices: number[]) =>
    indices.forEach((i) => (grid[i] = CellState.CrossedOut));

  addFilled([2, 12]);
  stepsLocal.push({
    id: 'step-1',
    title: 'Looking for larger clue numbers',
    description:
      'In any 5-wide line with a single 3, the middle cell is guaranteed no matter where the block goes.',
    cellStates: [...grid],
  });

  addFilled([17, 22]);
  addCrosses([7]);
  stepsLocal.push({
    id: 'step-2',
    title: 'Checking clue and gap combinations compared to the line length',
    description:
      'See the third column? It has a "1" and a "3" clue. And knowing that there is a gap of at least 1 cell between them, that gives us 5. As the column is only 5 cells high, we can fill in the blocks completely - remember the order of clues will always match the order they appear in the line.',
    cellStates: [...grid],
  });

  addCrosses([15, 16, 18, 19, 20, 24]);
  stepsLocal.push({
    id: 'step-3',
    title: 'Using filled cells to mark impossibilities',
    description:
      'We have quite a few filled cells now - and we can use them to mark some impossibilities! We use X to mark cells that cannot possibly be filled.\nFor example, in the fourth row, we have a filled cell in the middle - so the "1" clue must refer to that cell. In the fifth row, the "2" clue means we can mark an X on both cells that are more than 1 cell away from the filled cell in the middle.',
    cellStates: [...grid],
  });

  return stepsLocal;
})();

export function HowToPlayTutorial() {
  return (
    <Card withBorder radius="md" data-testid="how-to-play-tutorial">
      <CardSection withBorder inheritPadding py="sm">
        <Group justify="space-between" align="center">
          <Title order={4}>Step-By-Step Tutorial</Title>
          <Text size="sm" c="dimmed">
            Follow along with this simple nonogram to see how to approach solving puzzles.
          </Text>
        </Group>
      </CardSection>
      <CardSection inheritPadding py="md">
        <Carousel
          withIndicators
          slideSize="100%"
          controlsOffset="xs"
          data-testid="how-to-play-carousel"
        >
          {steps.map((step) => (
            <CarouselSlide key={step.id} data-testid={`how-to-play-step-${step.id}`}>
              <Stack gap="md" align="center">
                <Title order={4}>{step.title}</Title>
                <Group align="flex-start" gap="lg" wrap="wrap" justify="center">
                  <Grid
                    nonogram={tutorialNonogram}
                    rowHints={rowHints}
                    columnHints={columnHints}
                    winConditionMet
                    onWinConditionMet={() => {}}
                    interactive={false}
                    initialCellStates={step.cellStates}
                  />
                  <Stack gap="xs" maw={260}>
                    <Text size="sm" fw={600}>
                      Thought process
                    </Text>
                    <Text
                      size="sm"
                      c="dimmed"
                      data-testid="how-to-play-step-description"
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {step.description}
                    </Text>
                  </Stack>
                </Group>
              </Stack>
            </CarouselSlide>
          ))}
        </Carousel>
      </CardSection>
    </Card>
  );
}
