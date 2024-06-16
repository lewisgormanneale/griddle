import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 ">
      <div className="flex flex-col items-center gap-3">
        <h2 className="font-serif text-2xl">Nonogrammable</h2>
        <p className="font-serif">
          Solve this logic puzzle by filling in squares in a 15x15 grid to
          reveal a picture.
        </p>
        <div className="flex gap-3">
          <Link className="p-4 bg-orange-500 rounded" href="/nonogram">
            Log In
          </Link>
          <Link className="p-4 bg-orange-500 rounded" href="/nonogram">
            Play
          </Link>
        </div>
        <p className="font-serif">June 15th 2024</p>
        <p className="font-serif">No. 241</p>
      </div>
    </div>
  );
}
