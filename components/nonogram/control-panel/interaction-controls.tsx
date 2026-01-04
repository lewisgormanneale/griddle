import { IconEraser, IconHandFinger, IconMouse, IconSquareFilled, IconSquareX } from '@tabler/icons-react';
import { Button, ButtonGroup, Center, Flex, SegmentedControl } from '@mantine/core';

export type InteractionControlsProps = {
  interactionMode: 'cursor' | 'touch';
  onInteractionModeChange: (mode: 'cursor' | 'touch') => void;
  touchAction: 'fill' | 'cross' | 'erase';
  onTouchActionChange: (action: 'fill' | 'cross' | 'erase') => void;
};

const touchActions = [
  { value: 'fill', icon: <IconSquareFilled size={20} />, label: 'Fill' },
  { value: 'cross', icon: <IconSquareX size={20} />, label: 'Cross' },
  { value: 'erase', icon: <IconEraser size={20} />, label: 'Erase' },
] as const;

export function InteractionControls({
  interactionMode,
  onInteractionModeChange,
  touchAction,
  onTouchActionChange,
}: InteractionControlsProps) {
  return (
    <Flex justify="center" align="center" gap="sm" wrap="wrap" mt="xs">
      <SegmentedControl
        value={interactionMode}
        onChange={(value) => onInteractionModeChange(value as 'cursor' | 'touch')}
        data={[
          {
            label: (
              <Center w={26} h={26}>
                <IconMouse size={20} />
              </Center>
            ),
            value: 'cursor',
          },
          {
            label: (
              <Center w={26} h={26}>
                <IconHandFinger size={20} />
              </Center>
            ),
            value: 'touch',
          },
        ]}
        size="sm"
        aria-label="Interaction mode"
      />

      {interactionMode === 'touch' && (
        <ButtonGroup>
          {touchActions.map((action) => (
            <Button
              key={action.value}
              variant={touchAction === action.value ? 'filled' : 'light'}
              onClick={() => onTouchActionChange(action.value)}
              aria-label={action.label}
            >
              {action.icon}
            </Button>
          ))}
        </ButtonGroup>
      )}
    </Flex>
  );
}
