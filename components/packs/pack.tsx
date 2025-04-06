import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tables } from "@/types/database.types";
import { useEffect, useState } from "react";
import { getNonogramsForPack } from "@/lib/queries";
import NonogramGridPreview from "@/components/packs/nonogram-grid-preview";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const Pack = ({ pack }: { pack: Tables<"packs"> }) => {
  const [nonograms, setNonograms] = useState<Tables<"nonograms">[]>([]);
  useEffect(() => {
    getNonogramsForPack(pack.id).then((data) => setNonograms(data));
  }, [pack]);
  return (
    <Card className="w-full p-3" key={pack.id}>
      <CardHeader>
        <CardTitle>{pack.name}</CardTitle>
        <CardDescription>{pack.description}</CardDescription>
      </CardHeader>
      {nonograms && nonograms.length > 0 && (
        <ul className="flex gap-3 flex-wrap items-center justify-center">
          {nonograms.map((nonogram: any) => (
            <li key={nonogram.id}>
              <Card className="flex flex-col justify-between items-center bg-background p-2 h-[340px] w-[340px]">
                <CardHeader className="p-3 justify-center text-center">
                  <CardTitle>{nonogram.title}</CardTitle>
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
                    href={`/nonogram/${nonogram.id}`}
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
  );
};

export default Pack;
