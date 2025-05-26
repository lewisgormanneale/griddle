"use client";

import { getNonogram, getNonogramHints } from "@/utils/supabase/queries";
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

export default function NonogramPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [nonogram, setNonogram] = useState<Tables<"nonograms">>();
  const [rowHints, setRowHints] = useState<number[][]>([]);
  const [columnHints, setColumnHints] = useState<number[][]>([]);
  const [winConditionMet, setWinConditionMet] = useState(false);

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

  const onWinConditionMet = () => {
    setWinConditionMet(true);
  };

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
              <ControlPanel winConditionMet={winConditionMet} />
              <Grid
                nonogram={nonogram}
                rowHints={rowHints}
                columnHints={columnHints}
                winConditionMet={winConditionMet}
                onWinConditionMet={onWinConditionMet}
              />
              <Leaderboard />
            </CardContent>
          </>
        ) : (
          <></>
        )}
      </Card>
    </div>
  );
}
