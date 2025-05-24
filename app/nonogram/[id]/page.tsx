import { Nonogram } from "@/components/nonogram/nonogram";
import { getAllNonograms, getNonogram } from "@/lib/queries";
import { Metadata } from "next";
import { Tables } from "@/types/database.types"; //

export async function generateStaticParams() {
  const nonograms = await getAllNonograms();
  if (!nonograms) {
    return [];
  }
  return nonograms.map((nonogram: Tables<"nonograms">) => ({
    id: nonogram.id.toString(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata | null> {
  const nonogram = await getNonogram(Number(params.id));
  if (!nonogram) {
    return {};
  }
  return {
    title: nonogram.title,
  };
}

export default async function NonogramPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  return (
    <div className="h-screen w-full flex flex-col items-center p-4 gap-4 @container">
      <Nonogram id={id} />
    </div>
  );
}
