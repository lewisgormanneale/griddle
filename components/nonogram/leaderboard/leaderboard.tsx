'use client';

import { useEffect, useState } from 'react';
import { Box, Group, Loader, ScrollArea, Stack, Table, Text, Title } from '@mantine/core';
import { CompletedNonogramWithProfile, getTopNonogramCompletions } from '@/utils/supabase/queries';
import classes from './leaderboard.module.css';

export function Leaderboard({ nonogram_id }: { nonogram_id: number }) {
  const [topCompletions, setTopCompletions] = useState<CompletedNonogramWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTopNonogramCompletions(nonogram_id)
      .then((data) => setTopCompletions(data))
      .finally(() => setLoading(false));
  }, [nonogram_id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <Stack p="md" gap="md">
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
              <Table className={classes.table} striped highlightOnHover verticalSpacing="sm">
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
                      <td className={classes.time}>{formatTime(entry.completion_time)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className={classes.empty}>No completions yet.</div>
            )}
          </Box>
        </ScrollArea>
      </Stack>
    </Stack>
  );
}
