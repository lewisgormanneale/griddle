"use client";

import { CellState, InputMode, NonogramGrid } from "@/types/types";
import React, { useEffect, useState } from "react";
import { ControlPanel } from "@/components/nonogram/control-panel";
import { Grid } from "@/components/nonogram/grid";
import { Tables } from "@/types/database.types";
import { getNonogram } from "@/lib/queries";

export function Nonogram({ id }: { id: string }) {
  const [nonogram, setNonogram] = useState<Tables<"nonograms">>();
  const [grid, setGrid] = useState<NonogramGrid>([]);
  const [winConditionMet, setWinConditionMet] = useState(false);
  const [selectedInputMode, setSelectedInputMode] = useState(InputMode.Free);
  const [selectedFillState, setSelectedFillState] = useState(CellState.Filled);

  useEffect(() => {
    getNonogram(id).then((data) => setNonogram(data));
  }, []);

  useEffect(() => {
    if (nonogram) {
      const solutionArray = nonogram.solution.split("").map(Number);
      const rows = Array.from({ length: nonogram.rows }, (_, i) =>
        solutionArray.slice(i * nonogram.columns, (i + 1) * nonogram.columns),
      );
      setGrid(rows.map((row) => row.map(() => CellState.Blank)));
    }
  }, [nonogram]);

  const handleFillStateChange = (newFillState: CellState) => {
    setSelectedFillState(newFillState);
  };

  const handleInputModeStateChange = (newInputMode: InputMode) => {
    setSelectedInputMode(newInputMode);
  };

  const handleGridChange = (newGrid: NonogramGrid) => {
    setGrid(newGrid);
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
            grid={grid}
            winConditionMet={winConditionMet}
            selectedInputMode={selectedInputMode}
            selectedFillState={selectedFillState}
            onSelectedFillState={handleFillStateChange}
            onGridChange={handleGridChange}
          ></Grid>
        </>
      )}
    </div>
  );
}
