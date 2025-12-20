"use client";

import { useEffect, useState } from "react";
import {
  CompletedNonogramWithProfile,
  getTopNonogramCompletions,
} from "@/utils/supabase/queries";
import { Card } from "@mantine/core";

export function Leaderboard({ nonogram_id }: { nonogram_id: number }) {
  const [topCompletions, setTopCompletions] = useState<
    CompletedNonogramWithProfile[]
  >([]);

  useEffect(() => {
    getTopNonogramCompletions(nonogram_id).then(setTopCompletions);
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
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>The top times for this puzzle.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Username</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCompletions.length > 0 ? (
              topCompletions.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {entry.profiles?.username || "Unknown"}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatTime(entry.completion_time)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center text-muted-foreground"
                >
                  No completions yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
