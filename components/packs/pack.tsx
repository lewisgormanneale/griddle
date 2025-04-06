import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tables } from "@/types/database.types";
import { useEffect, useState } from "react";
import { getNonogramsForPack } from "@/lib/queries";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import NonogramGridPreview from "./nonogram-grid-preview";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const Pack = ({ pack }: { pack: Tables<"packs"> }) => {
  const [nonograms, setNonograms] = useState<Tables<"nonograms">[]>([]);
  useEffect(() => {
    getNonogramsForPack(pack.id).then((data) => setNonograms(data));
  }, [pack]);
  return (
    <Card className="p-3 max-w-screen-lg" key={pack.id}>
      <CardHeader>
        <CardTitle>{pack.name}</CardTitle>
        <CardDescription>{pack.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel>
          <CarouselContent>
            {nonograms.map((nonogram: any) => (
              <CarouselItem className="basis-1/3" key={nonogram.id}>
                <Card
                  className="bg-background h-full flex flex-col justify-between"
                  key={nonogram.id}
                >
                  <CardHeader className="justify-center p-6 pb-0">
                    <CardTitle>{nonogram.title}</CardTitle>
                    <CardDescription>
                      {nonogram.height} x {nonogram.width}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center p-3">
                    <NonogramGridPreview
                      rows={nonogram.height}
                      columns={nonogram.width}
                    ></NonogramGridPreview>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Link
                      className={buttonVariants({ variant: "outline" })}
                      href={`/nonogram/${nonogram.id}`}
                    >
                      Play
                    </Link>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default Pack;
