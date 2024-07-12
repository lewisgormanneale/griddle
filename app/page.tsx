import { ModeToggle } from "@/components/mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center p-4">
      <div className="flex flex-col items-center gap-3">
        <h2 className="font-serif text-2xl">Nonogrammable</h2>
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
        <p className="font-serif">June 15th 2024</p>
        <p className="font-serif">No. 241</p>
      </div>
    </div>
  );
}
