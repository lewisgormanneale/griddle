import { useEffect, useState } from 'react';
import { Timer } from '@/components/nonogram/control-panel/timer';

export function ControlPanel({
  winConditionMet,
  initialTime,
}: {
  winConditionMet: boolean;
  initialTime?: number;
}) {
  const [time, setTime] = useState(initialTime ?? 0);
  const [timerActive, setTimerActive] = useState(initialTime === undefined);

  useEffect(() => {
    if (winConditionMet) {
      setTimerActive(false);
    }
  }, [winConditionMet]);

  useEffect(() => {
    if (initialTime !== undefined) {
      setTime(initialTime);
      setTimerActive(false);
    }
  }, [initialTime]);

  return <Timer time={time} setTime={setTime} timerActive={timerActive} />;
}
