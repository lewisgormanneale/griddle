import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center p-4">
      <Card className="h-2/3 flex flex-col justify-center items-center text-center py-4 px-12 gap-8">
        <h2 className="font-serif text-2xl font-bold">Nonogrammable</h2>
        <p className="font-serif">
          Solve this logic puzzle by filling in squares in a 10x10 grid to
          reveal a picture.
        </p>
        <Link
          className={buttonVariants({ variant: "default" })}
          href="/nonogram"
        >
          Play
        </Link>
      </Card>
    </div>
  );
}
