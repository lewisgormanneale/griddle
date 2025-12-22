'use client';

import { useEffect, useState } from 'react';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { ActionIcon, useMantineColorScheme } from '@mantine/core';

export function ColorSchemeToggle() {
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering on the server to prevent hydration mismatches
  if (!mounted) return null;
  if (!colorScheme) return null;

  const isLight = colorScheme === 'light';

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      title={isLight ? 'Switch to dark' : 'Switch to light'}
      size="md"
      variant="default"
    >
      {isLight ? <IconMoon size={18} /> : <IconSun size={18} />}
    </ActionIcon>
  );
}
