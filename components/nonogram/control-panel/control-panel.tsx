import { useEffect, useState } from "react";
import { Timer } from "@/components/nonogram/control-panel/timer";

export function ControlPanel({
  winConditionMet,
}: {
  winConditionMet: boolean;
}) {
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    if (winConditionMet) {
      setTimerActive(false);
    }
  }, [winConditionMet]);

  return (
    <div className="flex items-center gap-3">
      <Timer time={time} setTime={setTime} timerActive={timerActive} />
    </div>
  );
}
