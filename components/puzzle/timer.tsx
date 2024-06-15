import { useEffect } from "react";

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
    let interval = null;
    if (timerActive)
      interval = setInterval(() => {
        setTime((time: number) => time + 1);
      }, 1000);
    else clearInterval(interval);
    return () => {
      clearInterval(interval);
    };
  }, [timerActive]);

  return <div>Time: {time}s</div>;
}
