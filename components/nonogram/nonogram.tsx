"use client";

import { CellState, InputMode } from "@/types/types";
import React, { useEffect, useState } from "react";
import { ControlPanel } from "@/components/nonogram/control-panel";
import { Tables } from "@/types/database.types";
import { getNonogram } from "@/lib/queries";
import { Grid } from "@/components/nonogram/grid";

export function Nonogram({ id }: { id: string }) {
  const [nonogram, setNonogram] = useState<Tables<"nonograms">>();
  const [winConditionMet, setWinConditionMet] = useState(false);
  const [selectedInputMode, setSelectedInputMode] = useState(InputMode.Free);
  const [selectedFillState, setSelectedFillState] = useState(CellState.Filled);

  useEffect(() => {
    getNonogram(id).then((data) => setNonogram(data));
  }, []);

  const handleFillStateChange = (newFillState: CellState) => {
    setSelectedFillState(newFillState);
  };

  const handleInputModeStateChange = (newInputMode: InputMode) => {
    setSelectedInputMode(newInputMode);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {nonogram && (
        <>
          <h1 className="text-3xl">
            Nonogram #{nonogram.id}:{" "}
            <span className="italic">&quot;{nonogram.title}&quot;</span>
          </h1>
          <ControlPanel
            nonogram={nonogram}
            winConditionMet={winConditionMet}
            selectedInputMode={selectedInputMode}
            selectedFillState={selectedFillState}
            onSelectedInputMode={handleInputModeStateChange}
            onSelectedFillState={handleFillStateChange}
          ></ControlPanel>
          <Grid
            nonogram={nonogram}
            winConditionMet={winConditionMet}
            selectedInputMode={selectedInputMode}
            selectedFillState={selectedFillState}
            onSelectedFillState={handleFillStateChange}
          ></Grid>
        </>
      )}
    </div>
  );
}
