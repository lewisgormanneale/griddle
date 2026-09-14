'use client';

import { useRef, useState } from 'react';
import { Carousel, CarouselSlide } from '@mantine/carousel';
import { Card, CardSection, Group, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { InteractionControls } from '@/components/nonogram/control-panel/interaction-controls';
import { Grid } from '@/components/nonogram/grid/grid';
import type { Tables } from '@/types/database.types';
import { CellState } from '@/types/types';

type TutorialStep = {
  id: string;
  title: string;
  description: string;
  cellStates: CellState[];
  interactive?: boolean;
};

const tutorialNonogram: Tables<'nonograms'> = {
  id: 0,
  title: 'Tutorial',
  width: 5,
  height: 5,
  solution: '0101011100111110011101010',
  pack_id: null,
  user_id: null,
  created_at: null,
  daily_date: null,
};

const rowHints = [[1, 1], [3], [5], [3], [1, 1]];
const columnHints = [[2], [3, 1], [3], [1, 3], [2]];

const makeEmpty = () => Array.from({ length: 25 }, () => CellState.Blank);

const steps: TutorialStep[] = (() => {
  const grid = makeEmpty();
  const stepsLocal: TutorialStep[] = [];

  const addFilled = (indices: number[]) => indices.forEach((i) => (grid[i] = CellState.Filled));
  const addCrosses = (indices: number[]) =>
    indices.forEach((i) => (grid[i] = CellState.CrossedOut));

  addFilled([10, 11, 12, 13, 14]);
  stepsLocal.push({
    id: 'step-1',
    title: 'Starting with certain lines',
    description:
      'When a row (or column) is the same length as its clue total, every cell is filled. The middle row has a clue of 5 in a 5-wide grid, so fill it completely.',
    cellStates: [...grid],
  });

  addCrosses([8]);
  addFilled([3, 18, 23]);
  stepsLocal.push({
    id: 'step-2',
    title: 'Checking clue and gap combinations compared to the line length',
    description:
      'See the fourth column? It has a "1" and a "3" clue. And knowing that there is a gap of at least 1 cell between them, that gives us 5. As the column is only 5 cells high, we can fill in the blocks completely - remember the order of clues will always match the order they appear in the line.',
    cellStates: [...grid],
  });

  addCrosses([2, 4, 15]);
  stepsLocal.push({
    id: 'step-3',
    title: 'Using filled cells to mark impossibilities',
    description:
      'In the first row, we have a filled cell - and the "1, 1" clue tells us that no filled cell in the first row can be adjacent to it.\nIn the fourth row, the "3" clue means we can mark an X on in the first column - as it is too far away from the filled cell to be possible.',
    cellStates: [...grid],
  });

  stepsLocal.push({
    id: 'step-4',
    title: 'Your turn to finish',
    description:
      'Now you know the basics: use the filled cells and the clues to complete the rest of this tiny puzzle. We will let you know once you have solved it.',
    cellStates: [...grid],
    interactive: true,
  });

  return stepsLocal;
})();

export function HowToPlayTutorial() {
  const [isInteractiveSolved, setIsInteractiveSolved] = useState(false);
  const [interactionMode, setInteractionMode] = useState<'cursor' | 'touch'>('cursor');
  const [touchAction, setTouchAction] = useState<'fill' | 'cross' | 'erase'>('fill');
  const notifiedRef = useRef(false);

  const handleInteractiveWin = () => {
    if (notifiedRef.current) {
      return;
    }
    notifiedRef.current = true;
    setIsInteractiveSolved(true);
    notifications.show({
      title: 'Solved!',
      message: 'Nice work, you completed the tutorial puzzle.',
      color: 'green',
    });
  };

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
        <Carousel slideSize="100%" controlsOffset="xs" data-testid="how-to-play-carousel">
          {steps.map((step) => {
            const isInteractive = Boolean(step.interactive);
            const isSolved = isInteractive && isInteractiveSolved;

            return (
              <CarouselSlide key={step.id} data-testid={`how-to-play-step-${step.id}`}>
                <Stack gap="md" align="center">
                  <Title order={4}>{step.title}</Title>
                  <Group align="flex-start" gap="lg" wrap="wrap" justify="center">
                    <Grid
                      nonogram={tutorialNonogram}
                      rowHints={rowHints}
                      columnHints={columnHints}
                      winConditionMet={isInteractive ? isSolved : true}
                      onWinConditionMet={isInteractive ? handleInteractiveWin : () => {}}
                      interactive={isInteractive}
                      interactionMode={isInteractive ? interactionMode : 'cursor'}
                      touchAction={isInteractive ? touchAction : 'fill'}
                      initialCellStates={step.cellStates}
                    />
                    <Stack gap="xs" maw={260}>
                      {isInteractive && (
                        <InteractionControls
                          interactionMode={interactionMode}
                          onInteractionModeChange={setInteractionMode}
                          touchAction={touchAction}
                          onTouchActionChange={setTouchAction}
                        />
                      )}
                      <Text
                        size="sm"
                        c="dimmed"
                        data-testid="how-to-play-step-description"
                        style={{ whiteSpace: 'pre-wrap' }}
                      >
                        {step.description}
                      </Text>
                      {isInteractive && (
                        <Text size="sm" fw={600} c={isSolved ? 'green' : 'blue'}>
                          {isSolved
                            ? 'Nice work! You have solved the tutorial puzzle.'
                            : 'Your turn: tap or click to fill/cross cells. We will let you know when it is solved.'}
                        </Text>
                      )}
                    </Stack>
                  </Group>
                </Stack>
              </CarouselSlide>
            );
          })}
        </Carousel>
      </CardSection>
    </Card>
  );
}
