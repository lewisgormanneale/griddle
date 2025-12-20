import { useEffect, useState } from "react";
import { Timer } from "@/components/nonogram/control-panel/timer";
import { Card } from "@mantine/core";

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
    <Card className="bg-secondary flex justify-center px-6">
      <Timer time={time} setTime={setTime} timerActive={timerActive} />
    </Card>
  );
}
