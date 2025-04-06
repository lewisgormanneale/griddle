"use client";

import React, { useEffect, useState } from "react";
import { ControlPanel } from "@/components/nonogram/control-panel";
import { Tables } from "@/types/database.types";
import { getNonogram, getNonogramHints } from "@/lib/queries";
import { Grid } from "@/components/nonogram/grid";

export function Nonogram({ id }: { id: string }) {
  const [nonogram, setNonogram] = useState<Tables<"nonograms">>();
  const [rowHints, setRowHints] = useState<number[][]>([]);
  const [columnHints, setColumnHints] = useState<number[][]>([]);
  const [winConditionMet, setWinConditionMet] = useState(false);

  useEffect(() => {
    getNonogram(id).then((data) => setNonogram(data));
    getNonogramHints(id).then(
      (data) => {
        setRowHints(data.rows);
        setColumnHints(data.columns);
      },
      (error) => console.error(error),
    );
  }, []);

  const onWinConditionMet = () => {
    setWinConditionMet(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {nonogram && (
        <>
          <h1 className="text-3xl">
            Nonogram #{nonogram.id}:{" "}
            <span className="italic">&quot;{nonogram.title}&quot;</span>
          </h1>
          <ControlPanel winConditionMet={winConditionMet}></ControlPanel>
          <Grid
            nonogram={nonogram}
            rowHints={rowHints}
            columnHints={columnHints}
            winConditionMet={winConditionMet}
            onWinConditionMet={onWinConditionMet}
          ></Grid>
        </>
      )}
      {winConditionMet && (
        <div className="text-green-500 text-xl font-bold">
          🎉 Congratulations! You solved the puzzle! 🎉
        </div>
      )}
    </div>
  );
}
