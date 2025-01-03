import {buttonVariants} from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <div className="h-screen w-full flex flex-col justify-center items-center p-4">
            <div className="h-2/3 w-2/3 flex flex-col justify-center items-center text-center py-4 px-12 gap-8">
                <h2 className="font-zen-dots uppercase text-6xl">Griddle</h2>
                <p className="font-serif text-2xl">
                    Solve logic puzzles by filling in squares according to numbers at the edges of the grid.
                </p>
                <div className="flex gap-3 flex-col">
                    <Link
                        className={buttonVariants({variant: "default", size: "lg"})}
                        href="/play"
                    >
                        Today&apos;s Puzzle
                    </Link>
                    <Link
                        className={buttonVariants({variant: "secondary", size: "lg"})}
                        href="/play"
                    >
                        Packs & Creations
                    </Link>
                </div>
            </div>
        </div>
    );
}
