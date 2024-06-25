"use client";

import { CellState, Puzzle } from "@/lib/types";
import { useEffect, useState } from "react";
import { generatePuzzle } from "@/lib/functions";
import { Grid } from "./grid";
import { Controls } from "./controls";
import React from "react";

export function Game() {
  const [puzzle, setPuzzle] = useState<Puzzle>([]);
  const [winConditionMet, setWinConditionMet] = useState(false);
  const [selectedFillState, setSelectedFillState] = useState(CellState.Filled);

  useEffect(() => {
    const initialPuzzle = generatePuzzle(5, 5);
    setPuzzle(initialPuzzle);
  }, []);

  const handleFillStateChange = (newFillState: CellState) => {
    setSelectedFillState(newFillState);
  };

  const handleWin = () => {
    setWinConditionMet(true);
  };

  const handleError = () => {
    console.log("ERROR");
  };

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {puzzle && puzzle.length > 0 && (
        <React.Fragment>
          <Controls
            winConditionMet={winConditionMet}
            selectedFillState={selectedFillState}
            onSelectedFillState={handleFillStateChange}
          />
          <Grid
            puzzle={puzzle}
            selectedFillState={selectedFillState}
            winConditionMet={winConditionMet}
            onWin={handleWin}
            onError={handleError}
          />
          {winConditionMet && <h1 className="text-3xl font-bold">You Win!</h1>}
        </React.Fragment>
      )}
    </div>
  );
}
