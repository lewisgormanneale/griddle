"use client";

import {
  getNonogram,
  getNonogramHints,
  getUserCompletionOfNonogram,
  saveNonogramCompletion,
} from "@/utils/supabase/queries";
import { Tables } from "@/types/database.types";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ControlPanel } from "@/components/nonogram/control-panel/control-panel"; //
import { Grid } from "@/components/nonogram/grid/grid";
import { Leaderboard } from "@/components/nonogram/leaderboard";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";

export default function NonogramPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [nonogram, setNonogram] = useState<Tables<"nonograms">>();
  const [rowHints, setRowHints] = useState<number[][]>([]);
  const [columnHints, setColumnHints] = useState<number[][]>([]);
  const [winConditionMet, setWinConditionMet] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [completion, setCompletion] =
    useState<Tables<"completed_nonograms"> | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) return;

      const completed = await getUserCompletionOfNonogram(user.id, Number(id));
      if (completed) {
        setCompletion(completed);
        setWinConditionMet(true); // disable further editing if already completed
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!completion) {
      setStartTime(Date.now());
    }
  }, [completion]);

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
      nonogram_id: Number(id),
      completion_time: durationInSeconds,
    });
  };

  useEffect(() => {
    getNonogram(Number(id)).then((data) => setNonogram(data));
    getNonogramHints(Number(id)).then(
      (data) => {
        setRowHints(data.rows);
        setColumnHints(data.columns);
      },
      (error) => console.error(error),
    );
  }, [id]);

  return (
    <div className="h-screen w-full flex flex-col items-center p-4 gap-4 @container">
      <Card className="w-full">
        {nonogram ? (
          <>
            <CardHeader>
              <CardTitle>
                #{nonogram.id}:{" "}
                <span className="italic">&quot;{nonogram.title}&quot;</span>
              </CardTitle>
              <CardDescription>
                <span>
                  {nonogram.height} x {nonogram.width} | {nonogram.author} |{" "}
                  {nonogram.license} | {nonogram.copyright}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 items-center">
              <Separator />
              <div className="my-6">
                <ControlPanel winConditionMet={winConditionMet} />
                <Grid
                  nonogram={nonogram}
                  rowHints={rowHints}
                  columnHints={columnHints}
                  winConditionMet={winConditionMet}
                  onWinConditionMet={onWinConditionMet}
                />
              </div>
              <Separator />
              <Leaderboard nonogram_id={nonogram.id} />
            </CardContent>
          </>
        ) : (
          <></>
        )}
      </Card>
    </div>
  );
}
