import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center p-4 mt-8">
      <div className="flex flex-col items-center gap-3">
        <h2 className="font-serif text-2xl">Nonogrammable</h2>
        <p className="font-serif">
          Solve this logic puzzle by filling in squares in a 10x10 grid to
          reveal a picture.
        </p>
        <Button>
          <Link href="/nonogram">Play</Link>
        </Button>
        <p className="font-serif">June 15th 2024</p>
        <p className="font-serif">No. 241</p>
      </div>
    </div>
  );
}
