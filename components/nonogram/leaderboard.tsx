"use client";

import { useEffect, useState } from "react";
import {
  CompletedNonogramWithProfile,
  getTopNonogramCompletions,
} from "@/utils/supabase/queries";
import { Card, Table, Title, ScrollArea, Loader, Text } from "@mantine/core";

export function Leaderboard({ nonogram_id }: { nonogram_id: number }) {
  const [topCompletions, setTopCompletions] = useState<
    CompletedNonogramWithProfile[]
  >([]);

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
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <Card className="w-full bg-background">
      <Card.Section withBorder style={{ padding: 12 }}>
        <Title order={3}>Leaderboard</Title>
      </Card.Section>

      <Card.Section>
        <ScrollArea>
          <div className="p-4">
            <Text size="sm" color="dimmed" className="mb-2">
              The top times for this puzzle.
            </Text>

            {loading ? (
              <div className="flex justify-center py-4">
                <Loader />
              </div>
            ) : topCompletions.length > 0 ? (
              <Table striped highlightOnHover verticalSpacing="sm">
                <thead>
                  <tr>
                    <th style={{ width: 100 }}>Username</th>
                    <th className="text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {topCompletions.map((entry, index) => (
                    <tr key={index}>
                      <td className="font-medium">
                        {entry.profiles?.username || "Unknown"}
                      </td>
                      <td className="text-right">
                        {formatTime(entry.completion_time)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                No completions yet.
              </div>
            )}
          </div>
        </ScrollArea>
      </Card.Section>
    </Card>
  );
}
