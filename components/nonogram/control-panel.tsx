import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Timer } from "@/components/nonogram/timer";

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
    <Card className="w-64 flex justify-center items-center gap-3 p-3">
      <div className="flex items-center gap-3">
        <Timer time={time} setTime={setTime} timerActive={timerActive} />
      </div>
    </Card>
  );
}
