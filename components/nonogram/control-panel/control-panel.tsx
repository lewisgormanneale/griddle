import { useEffect, useState } from 'react';
import { InteractionControls, InteractionControlsProps } from './interaction-controls';
import { Timer } from '@/components/nonogram/control-panel/timer';

type ControlPanelProps = {
  winConditionMet: boolean;
  initialTime?: number;
} & Partial<InteractionControlsProps>;

export function ControlPanel({
  winConditionMet,
  initialTime,
  interactionMode,
  onInteractionModeChange,
  touchAction,
  onTouchActionChange,
}: ControlPanelProps) {
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

  return (
    <>
      <Timer time={time} setTime={setTime} timerActive={timerActive} />
      {interactionMode && onInteractionModeChange && touchAction && onTouchActionChange ? (
        <InteractionControls
          interactionMode={interactionMode}
          onInteractionModeChange={onInteractionModeChange}
          touchAction={touchAction}
          onTouchActionChange={onTouchActionChange}
        />
      ) : null}
    </>
  );
}
