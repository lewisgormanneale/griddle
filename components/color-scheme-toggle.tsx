'use client';

import { useEffect, useState } from 'react';
import { IconCheck, IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react';
import { ActionIcon, Menu, useMantineColorScheme } from '@mantine/core';

const options = [
  { value: 'light', label: 'Light', icon: IconSun },
  { value: 'dark', label: 'Dark', icon: IconMoon },
  { value: 'auto', label: 'System', icon: IconDeviceDesktop },
] as const;

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering on the server to prevent hydration mismatches
  if (!mounted || !colorScheme) {
    return null;
  }

  const ActiveIcon = options.find((option) => option.value === colorScheme)?.icon ?? IconSun;

  return (
    <Menu shadow="md" width={160} position="bottom-end">
      <Menu.Target>
        <ActionIcon aria-label="Change theme" title="Change theme" size="md" variant="default">
          <ActiveIcon size={18} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            leftSection={<option.icon size={16} />}
            rightSection={colorScheme === option.value ? <IconCheck size={14} /> : null}
            onClick={() => setColorScheme(option.value)}
          >
            {option.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
