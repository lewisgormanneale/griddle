'use client';

import { useEffect, useMemo, useState } from 'react';
import { Box, Card, Divider, Flex, Group, LoadingOverlay, Skeleton, Text } from '@mantine/core';
import { ControlPanel } from '@/components/nonogram/control-panel/control-panel';
import { Grid } from '@/components/nonogram/grid/grid';
import { Leaderboard } from '@/components/nonogram/leaderboard/leaderboard';
import type { Tables } from '@/types/database.types';
import { CellState } from '@/types/types';
import { createClient } from '@/utils/supabase/client';
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
  const [winConditionMet, setWinConditionMet] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [completion, setCompletion] = useState<Tables<'completed_nonograms'> | null>(null);
  const [completionLoading, setCompletionLoading] = useState(true);
  const solvedCellStates = useMemo(() => {
    if (!completion) return undefined;
    return nonogram.solution.split('').map((value) =>
      value === '1' ? CellState.Filled : CellState.CrossedOut
    );
  }, [completion, nonogram.solution]);

  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData.session?.user;
        if (!user) return;

        const completed = await getUserCompletionOfNonogram(user.id, nonogram.id);
        if (completed) {
          setCompletion(completed);
          setWinConditionMet(true);
        }
      } finally {
        setCompletionLoading(false);
      }
    };

    fetchData();
  }, [nonogram.id]);

  useEffect(() => {
    if (!completion && !completionLoading) {
      setStartTime(Date.now());
    }
  }, [completion, completionLoading]);

  const onWinConditionMet = async () => {
    setWinConditionMet(true);
    const supabase = createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user || startTime === null) return;

    const endTime = Date.now();
    const durationInSeconds = Math.floor((endTime - startTime) / 1000);

    await saveNonogramCompletion({
      user_id: user.id,
      nonogram_id: nonogram.id,
      completion_time: durationInSeconds,
    });
  };

  return (
    <Flex direction="column" align="center">
      <Card w="100%">
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
          <Card withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              {completionLoading ? (
                <Skeleton height={20} width={80} />
              ) : (
                <ControlPanel
                  winConditionMet={winConditionMet}
                  initialTime={completion?.completion_time}
                />
              )}
            </Card.Section>
            <Card.Section>
              <Flex justify="center" p="md">
                <Box pos="relative" mih={220}>
                  <LoadingOverlay visible={completionLoading} />
                  {!completionLoading && (
                    <Grid
                      nonogram={nonogram}
                      rowHints={rowHints}
                      columnHints={columnHints}
                      winConditionMet={winConditionMet}
                      onWinConditionMet={onWinConditionMet}
                      interactive={!completion}
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
