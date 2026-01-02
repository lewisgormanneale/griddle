'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  IconEraser,
  IconHandFinger,
  IconMouse,
  IconSquareFilled,
  IconSquareX,
} from '@tabler/icons-react';
import {
  Box,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  SegmentedControl,
  Text,
} from '@mantine/core';
import { ControlPanel } from '@/components/nonogram/control-panel/control-panel';
import { Grid } from '@/components/nonogram/grid/grid';
import { Leaderboard } from '@/components/nonogram/leaderboard/leaderboard';
import { useAsyncData } from '@/hooks/use-async-data';
import { useAuthUser } from '@/hooks/use-auth-user';
import type { Tables } from '@/types/database.types';
import { CellState } from '@/types/types';
import {
  getUserCompletionOfNonogram,
  NonogramWithProfile,
  saveNonogramCompletion,
} from '@/utils/supabase/queries';

type NonogramClientProps = {
  nonogram: NonogramWithProfile;
  rowHints: number[][];
  columnHints: number[][];
};

export function NonogramClient({ nonogram, rowHints, columnHints }: NonogramClientProps) {
  const { user, loading: authLoading } = useAuthUser();
  const [winConditionMet, setWinConditionMet] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [interactionMode, setInteractionMode] = useState<'cursor' | 'touch'>('cursor');
  const [touchAction, setTouchAction] = useState<'fill' | 'cross' | 'erase'>('fill');
  const touchActions = [
    { value: 'fill', icon: <IconSquareFilled size={20} />, label: 'Fill' },
    { value: 'cross', icon: <IconSquareX size={20} />, label: 'Cross' },
    { value: 'erase', icon: <IconEraser size={20} />, label: 'Erase' },
  ] as const;
  const {
    data: completion,
    loading: completionLoading,
    setData: setCompletion,
  } = useAsyncData<Tables<'completed_nonograms'> | null>(
    () =>
      user
        ? getUserCompletionOfNonogram(user.id, nonogram.id).then((result) => result ?? null)
        : Promise.resolve(null),
    [user?.id, nonogram.id],
    {
      initialData: null,
      enabled: !authLoading,
    }
  );
  const solvedCellStates = useMemo(() => {
    if (!completion) {
      return undefined;
    }
    return nonogram.solution
      .split('')
      .map((value) => (value === '1' ? CellState.Filled : CellState.CrossedOut));
  }, [completion, nonogram.solution]);

  useEffect(() => {
    if (completion) {
      setWinConditionMet(true);
      return;
    }
    setWinConditionMet(false);
  }, [completion]);

  useEffect(() => {
    if (!user) {
      setStartTime(null);
      return;
    }
    if (!completion && !completionLoading && !authLoading) {
      setStartTime((current) => current ?? Date.now());
    }
  }, [authLoading, completion, completionLoading, user]);

  const onWinConditionMet = async () => {
    setWinConditionMet(true);
    if (!user || startTime === null) {
      return;
    }

    const endTime = Date.now();
    const durationInSeconds = Math.floor((endTime - startTime) / 1000);

    const saved = await saveNonogramCompletion({
      user_id: user.id,
      nonogram_id: nonogram.id,
      completion_time: durationInSeconds,
    });

    if (saved) {
      setCompletion((previous) => previous ?? saved[0]);
    }
  };

  return (
    <Flex direction="column" align="center" data-testid="nonogram-client">
      <Card w="100%" data-testid="nonogram-card">
        <Card.Section withBorder inheritPadding py="xs">
          <Group justify="space-between">
            <Text c="dimmed" size="sm">
              <span>
                {nonogram.height} x {nonogram.width}
                {nonogram.profiles?.username ? ` | ${nonogram.profiles.username}` : ''}
              </span>
            </Text>
          </Group>
        </Card.Section>
        <Card.Section p="md">
          <Card withBorder data-testid="nonogram-grid-card">
            <Card.Section withBorder inheritPadding py="xs" data-testid="nonogram-control-panel">
              <ControlPanel
                winConditionMet={winConditionMet}
                initialTime={completion?.completion_time}
              />
              <Group justify="space-between" mt="xs">
                <SegmentedControl
                  value={interactionMode}
                  onChange={(value) => setInteractionMode(value as 'cursor' | 'touch')}
                  data={[
                    {
                      label: (
                        <Center w={32} h={32}>
                          <IconMouse size={24} />
                        </Center>
                      ),
                      value: 'cursor',
                    },
                    {
                      label: (
                        <Center w={32} h={32}>
                          <IconHandFinger size={24} />
                        </Center>
                      ),
                      value: 'touch',
                    },
                  ]}
                  size="sm"
                  aria-label="Interaction mode"
                />

                {interactionMode === 'touch' && (
                  <Button.Group>
                    {touchActions.map((action) => (
                      <Button
                        key={action.value}
                        variant={touchAction === action.value ? 'filled' : 'light'}
                        onClick={() => setTouchAction(action.value)}
                        aria-label={action.label}
                      >
                        {action.icon}
                      </Button>
                    ))}
                  </Button.Group>
                )}
              </Group>
            </Card.Section>
            <Card.Section>
              <Flex justify="center" p="md">
                <Box pos="relative" mih={220} data-testid="nonogram-grid-container">
                  <LoadingOverlay visible={completionLoading || authLoading} />
                  {!completionLoading && !authLoading && (
                    <Grid
                      nonogram={nonogram}
                      rowHints={rowHints}
                      columnHints={columnHints}
                      winConditionMet={winConditionMet}
                      onWinConditionMet={onWinConditionMet}
                      interactive={!completion}
                      interactionMode={interactionMode}
                      touchAction={touchAction}
                      initialCellStates={solvedCellStates}
                    />
                  )}
                </Box>
              </Flex>
            </Card.Section>
          </Card>
        </Card.Section>
        <Card.Section>
          <Divider className="my-4" />
          <Leaderboard nonogram_id={nonogram.id} />
        </Card.Section>
      </Card>
    </Flex>
  );
}
