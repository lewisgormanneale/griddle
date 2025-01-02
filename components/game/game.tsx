"use client";

import { CellState, Puzzle, InputMode } from "@/lib/types";
import { useEffect, useState } from "react";
import { generatePuzzle } from "@/lib/functions";
import { Grid } from "./grid";
import { Controls } from "./controls";
import React from "react";
import {supabase} from "@/utils/supabase/client";

export function Game() {
  const [puzzle, setPuzzle] = useState<Puzzle>([]);
  const [winConditionMet, setWinConditionMet] = useState(false);
  const [selectedInputMode, setSelectedInputMode] = useState(InputMode.Free);
  const [selectedFillState, setSelectedFillState] = useState(CellState.Filled);

  useEffect(() => {
    async function getNonogram() {
      try {
        const response = await fetch(`/api/nonograms?id=1`)
        const data = await response.json()
        console.log(data)
      } catch (error) {
        console.error(error)
      }
    }
    getNonogram()
  }, [])

  useEffect(() => {
    const initialPuzzle = generatePuzzle(10, 10);
    setPuzzle(initialPuzzle);
  }, []);

  const handleFillStateChange = (newFillState: CellState) => {
    setSelectedFillState(newFillState);
  };

  const handleInputModeStateChange = (newInputMode: InputMode) => {
    setSelectedInputMode(newInputMode);
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
            selectedInputMode={selectedInputMode}
            selectedFillState={selectedFillState}
            onSelectedInputMode={handleInputModeStateChange}
            onSelectedFillState={handleFillStateChange}
          />
          <Grid
            puzzle={puzzle}
            selectedInputMode={selectedInputMode}
            selectedFillState={selectedFillState}
            winConditionMet={winConditionMet}
            onSelectedFillState={handleFillStateChange}
            onWin={handleWin}
            onError={handleError}
          />
          {winConditionMet && <h1 className="text-3xl font-bold">You Win!</h1>}
        </React.Fragment>
      )}
    </div>
  );
}
