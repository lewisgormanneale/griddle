'use client';

import { AppShell, Box, Burger, Flex, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from '@/app/layout.module.css';
import { ColorSchemeToggle } from '@/components/color-scheme-toggle';
import { Navbar } from '@/components/navbar/navbar';

export function AppShellLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Flex justify="space-between" align="center" h="100%">
          <Group align="center" h="100%" px="sm" gap="sm">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text size="xl" lh={0} tt="uppercase" className="font-zen-dots">
              Griddle
            </Text>
          </Group>
          <Group align="center" h="100%" px="sm" gap="sm">
            <ColorSchemeToggle />
          </Group>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar close={close} />
      </AppShell.Navbar>
      <AppShell.Main>
        <Box p="md" className={classes.page}>
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
