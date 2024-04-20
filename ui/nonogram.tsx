export function Nonogram({ puzzle }: { puzzle: number[][] }) {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="grid grid-cols-5 gap-2">
        {puzzle.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`w-6 h-6 ${cell ? "bg-black" : "bg-white"}`}
            />
          ))
        )}
      </div>
    </main>
  );
}
