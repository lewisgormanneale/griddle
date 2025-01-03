"use client";

import {CellState, InputMode, NonogramGrid} from "@/types/types";
import React, {useEffect, useState} from "react";
import {ControlPanel} from "@/components/nonogram/control-panel";
import {Grid} from "@/components/nonogram/grid";
import {Tables} from "@/types/database.types";
import {Hints} from "@/components/nonogram/hints";

export function Nonogram() {
    const [nonogram, setNonogram] = useState<Tables<"nonograms">>();
    const [grid, setGrid] = useState<NonogramGrid>([]);
    const [winConditionMet, setWinConditionMet] = useState(false);
    const [selectedInputMode, setSelectedInputMode] = useState(InputMode.Free);
    const [selectedFillState, setSelectedFillState] = useState(CellState.Filled);

    useEffect(() => {
        async function getNonogram() {
            try {
                const response = await fetch(`/api/nonograms?id=2`)
                return await response.json()
            } catch (error) {
                console.error(error)
            }
        }

        getNonogram().then(data => setNonogram(data));
    }, [])

    useEffect(() => {
        if (nonogram) {
            const solutionArray = nonogram.solution.split("").map(Number);
            const rows = Array.from({length: nonogram.rows}, (_, i) =>
                solutionArray.slice(i * nonogram.columns, (i + 1) * nonogram.columns)
            );
            setGrid(rows.map(row => row.map(() => CellState.Blank)));
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
    }

    return (
        <div className="flex flex-col items-center gap-3 w-full">
            {nonogram && (
                <div>
                    <h1 className="flex flex-col items-center text-3xl">Nonogram
                        #{nonogram.id}: <span className="italic">&quot;{nonogram.title}&quot;</span></h1>
                    <div className="grid grid-cols-3 grid-rows-3">
                        <div className="p-3">
                            <ControlPanel
                                nonogram={nonogram}
                                winConditionMet={winConditionMet}
                                selectedInputMode={selectedInputMode}
                                selectedFillState={selectedFillState}
                                onSelectedInputMode={handleInputModeStateChange}
                                onSelectedFillState={handleFillStateChange}
                            ></ControlPanel>
                        </div>
                        <div className="col-span-2">
                            <Hints
                                nonogram={nonogram}
                                grid={grid}
                                isColumn={true}
                            ></Hints>
                        </div>
                        <div className="row-span-2 row-start-2">
                            <Hints
                                nonogram={nonogram}
                                grid={grid}
                                isColumn={false}
                            ></Hints>
                        </div>
                        <div className="col-span-2 row-span-2 row-start-2">
                            <Grid
                                grid={grid}
                                winConditionMet={winConditionMet}
                                selectedInputMode={selectedInputMode}
                                selectedFillState={selectedFillState}
                                onSelectedFillState={handleFillStateChange}
                                onGridChange={handleGridChange}
                            ></Grid>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
