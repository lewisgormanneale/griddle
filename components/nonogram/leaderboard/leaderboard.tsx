'use client';

import { useCallback } from 'react';
import { Box, Group, Loader, ScrollArea, Stack, Table, Text, Title } from '@mantine/core';
import { useAsyncData } from '@/hooks/use-async-data';
import { CompletedNonogramWithProfile, getTopNonogramCompletions } from '@/utils/supabase/queries';
import { formatTime } from '@/utils/utils';
import classes from './leaderboard.module.css';

export function Leaderboard({ nonogram_id }: { nonogram_id: number }) {
  const loadCompletions = useCallback(() => getTopNonogramCompletions(nonogram_id), [nonogram_id]);
  const { data: topCompletions = [], loading } = useAsyncData<CompletedNonogramWithProfile[]>(
    loadCompletions,
    [loadCompletions],
    { initialData: [] }
  );
  const formatLeaderboardTime = (seconds: number) => {
    const [hrs, mins, secs] = formatTime(seconds).split(':');
    return hrs === '00' ? `${mins}:${secs}` : `${hrs}:${mins}:${secs}`;
  };

  return (
    <Stack p="md" gap="md" data-testid="leaderboard">
      <Group>
        <Title order={3} m={0} mb={0} pb={0} lh={0} pt={8}>
          Leaderboard
        </Title>
      </Group>
      <Stack>
        <ScrollArea h={240}>
          <Box>
            <Text size="sm" c="dimmed" className={classes.description}>
              The top times for this puzzle.
            </Text>

            {loading ? (
              <div className={classes.loaderWrapper}>
                <Loader />
              </div>
            ) : topCompletions.length > 0 ? (
              <Table
                className={classes.table}
                striped
                highlightOnHover
                verticalSpacing="sm"
                data-testid="leaderboard-table"
              >
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>#</th>
                    <th style={{ width: 100 }}>Username</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {topCompletions.map((entry, index) => (
                    <tr key={index} className={classes.row} data-rank={index + 1}>
                      <td>{index + 1}.</td>
                      <td className={classes.username}>{entry.profiles?.username || 'Unknown'}</td>
                      <td className={classes.time}>
                        {formatLeaderboardTime(entry.completion_time)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className={classes.empty} data-testid="leaderboard-empty">
                No completions yet.
              </div>
            )}
          </Box>
        </ScrollArea>
      </Stack>
    </Stack>
  );
}
