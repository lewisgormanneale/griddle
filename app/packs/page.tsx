"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getAllNonograms } from "@/lib/queries";
import NonogramGridPreview from "@/components/packs/nonogram-grid-preview";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function PacksPage() {
  const [nonograms, setNonograms] = useState<any[]>([]);

  useEffect(() => {
    getAllNonograms().then((data) => setNonograms(data));
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center p-4 gap-4">
      <h1 className="text-3xl">Packs</h1>
      <Card className="w-full p-3">
        <h1 className="text-2xl mb-3">Example Pack</h1>
        {nonograms && nonograms.length > 0 && (
          <ul className="flex gap-3 flex-wrap items-center justify-center">
            {nonograms.map((nonogram: any) => (
              <li key={nonogram.id}>
                <Card className="flex flex-col justify-between items-center bg-background p-2 h-[340px] w-[340px]">
                  <CardHeader className="p-3 justify-center text-center">
                    <CardTitle>
                      #{nonogram.id}: {nonogram.title}
                    </CardTitle>
                    <CardDescription>
                      {nonogram.height} x {nonogram.width}
                    </CardDescription>
                  </CardHeader>
                  <NonogramGridPreview
                    rows={nonogram.height}
                    columns={nonogram.width}
                  ></NonogramGridPreview>
                  <CardFooter className="justify-center p-3">
                    <Link
                      className={buttonVariants({ variant: "outline" })}
                      href={`/nonogram?${nonogram.id}`}
                    >
                      Play
                    </Link>
                  </CardFooter>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
