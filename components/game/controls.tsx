import { useEffect } from "react";

export function Controls({
  time,
  setTime,
  timerActive,
}: {
  time: number;
  setTime: Function;
  timerActive: boolean;
}) {
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTime((time: number) => time + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerActive, setTime]);

  return (
    <div className="flex  justify-between items-center w-full p-4 rounded bg-orange-400 dark:bg-orange-700">
      <div>Time: {time}s</div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTime(0)}
          className="px-4 py-1 rounded bg-orange-500 dark:bg-orange-800"
        >
          Help
        </button>
        <button
          onClick={() => setTime(0)}
          className="px-4 py-1 rounded bg-orange-500 dark:bg-orange-800"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
