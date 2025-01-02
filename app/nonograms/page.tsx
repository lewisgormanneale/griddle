"use client"

import {Card} from "@/components/ui/card";
import {useEffect, useState} from "react";

export default function Nonograms() {
    const [nonograms, setNonograms] = useState<any[]>([]);

    useEffect(() => {
        async function getNonograms() {
            try {
                const response = await fetch(`/api/nonograms`)
                return await response.json();
            } catch (error) {
                console.error(error)
            }
        }

        getNonograms().then(data => setNonograms(data));
    }, [nonograms])
    return (
        <div className="h-screen w-full flex flex-col items-center p-4">
            <Card>
                <h1>Nonograms</h1>
                {nonograms && nonograms.length > 0 && (
                    <ul>
                        {nonograms.map((nonogram: any) => (
                            <li key={nonogram.id}>{nonogram.title}</li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
}
