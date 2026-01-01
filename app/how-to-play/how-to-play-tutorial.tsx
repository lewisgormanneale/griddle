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

const steps: TutorialStep[] = [
  {
    id: 'clue-3',
    title: 'Start with a 3',
    description: 'Row one has a single 3, so the middle three cells must be filled.',
    cellStates: (() => {
      const next = makeEmpty();
      next[1] = CellState.Filled;
      next[2] = CellState.Filled;
      next[3] = CellState.Filled;
      return next;
    })(),
  },
  {
    id: 'column-3',
    title: 'Use overlaps',
    description: 'Column three has a 3, so the center stack locks in another filled cell.',
    cellStates: (() => {
      const next = makeEmpty();
      [1, 2, 3].forEach((col) => {
        next[col] = CellState.Filled;
      });
      next[2 + 5 * 2] = CellState.Filled;
      return next;
    })(),
  },
  {
    id: 'mark-empties',
    title: 'Mark empties',
    description: 'Once a run is complete, mark the remaining cells as empty and move on.',
    cellStates: (() => {
      const next = makeEmpty();
      next[1] = CellState.Filled;
      next[2] = CellState.Filled;
      next[3] = CellState.Filled;
      next[0] = CellState.CrossedOut;
      next[4] = CellState.CrossedOut;
      return next;
    })(),
  },
];

export function HowToPlayTutorial() {
  return (
    <Card withBorder radius="md" data-testid="how-to-play-tutorial">
      <CardSection withBorder inheritPadding py="sm">
        <Group justify="space-between" align="center">
          <Title order={4}>Step-By-Step Tutorial</Title>
          <Text size="sm" c="dimmed">
            Swipe through each step.
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
              <Stack gap="md">
                <Title order={4}>{step.title}</Title>
                <Group align="flex-start" gap="lg" wrap="wrap">
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
                    <Text size="sm" c="dimmed" data-testid="how-to-play-step-description">
                      {step.description}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Keep bouncing between rows and columns to reveal more forced moves.
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
