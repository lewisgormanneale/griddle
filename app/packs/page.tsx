"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getAllNonograms } from "@/lib/queries";

export default function PacksPage() {
  const [nonograms, setNonograms] = useState<any[]>([]);

  useEffect(() => {
    getAllNonograms().then((data) => setNonograms(data));
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center p-4 gap-4">
      <h1 className="text-3xl">Nonograms</h1>
      <Card className="w-full p-3">
        <h1 className="text-2xl mb-3">Example Pack</h1>
        {nonograms && nonograms.length > 0 && (
          <ul className="flex gap-3">
            {nonograms.map((nonogram: any) => (
              <li key={nonogram.id} className="flex flex-col justify-center">
                <span className="text-center">{nonogram.title}</span>
                <div className="h-32 w-32 bg-black"></div>
                <span className="text-center">
                  {nonogram.rows} x {nonogram.columns}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
