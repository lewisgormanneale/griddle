import { Tables } from "@/types/database.types";
import { useEffect, useState } from "react";
import { getNonogramsForPack } from "@/utils/supabase/queries";
import NonogramGridPreview from "./nonogram-grid-preview";
import Link from "next/link";
import { Card } from "@mantine/core";

const Pack = ({ pack }: { pack: Tables<"packs"> }) => {
  const [nonograms, setNonograms] = useState<Tables<"nonograms">[]>([]);
  useEffect(() => {
    getNonogramsForPack(pack.id).then((data) => setNonograms(data));
  }, [pack]);
  return (
    <Card>
      <Card.Section withBorder style={{ padding: 12 }}>
        <h2 className="text-lg font-medium">{pack.name}</h2>
      </Card.Section>
      <Card.Section>
        <p className="p-4">{pack.description}</p>
      </Card.Section>
      <Card.Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {nonograms.map((nonogram) => (
            <Card
              className="bg-background h-full flex flex-col justify-between"
              key={nonogram.id}
            >
              <Card.Section className="justify-center p-6 pb-0">
                <h3 className="text-md font-medium">{nonogram.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {nonogram.height} x {nonogram.width}
                </p>
              </Card.Section>
              <Card.Section className="flex flex-col items-center p-3">
                <NonogramGridPreview
                  rows={nonogram.height}
                  columns={nonogram.width}
                ></NonogramGridPreview>
              </Card.Section>
              <Card.Section className="justify-end p-4">
                <Link
                  className="text-sm font-medium text-primary hover:underline"
                  href={`/nonogram/${nonogram.id}`}
                >
                  Play
                </Link>
              </Card.Section>
            </Card>
          ))}
        </div>
      </Card.Section>
    </Card>
  );
};

export default Pack;
