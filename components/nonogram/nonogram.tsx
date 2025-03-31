"use client";

import React, { useEffect, useState } from "react";
import { ControlPanel } from "@/components/nonogram/control-panel";
import { Tables } from "@/types/database.types";
import { getNonogram } from "@/lib/queries";
import { Grid } from "@/components/nonogram/grid";

export function Nonogram({ id }: { id: string }) {
  const [nonogram, setNonogram] = useState<Tables<"nonograms">>();
  const [winConditionMet, setWinConditionMet] = useState(false);

  useEffect(() => {
    getNonogram(id).then((data) => setNonogram(data));
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
