import { useEffect } from "react";
import { formatTime } from "@/utils/utils";

export function Timer({
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
    <div
      className={`font-serif text-2xl ${!timerActive ? "text-green-500" : ""} `}
    >
      {formatTime(time)}
    </div>
  );
}
