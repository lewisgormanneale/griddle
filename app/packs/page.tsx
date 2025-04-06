"use client";

import { useEffect, useState } from "react";
import { getAllPacks } from "@/lib/queries";
import { Tables } from "@/types/database.types";
import Pack from "@/components/packs/pack";

export default function PacksPage() {
  const [packs, setPacks] = useState<Tables<"packs">[]>([]);

  useEffect(() => {
    getAllPacks().then((data) => setPacks(data));
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center p-4 gap-4">
      <h1 className="text-3xl">Packs</h1>
      {packs &&
        packs.length > 0 &&
        packs.map((pack: Tables<"packs">) => (
          <Pack key={pack.id} pack={pack} />
        ))}
    </div>
  );
}
