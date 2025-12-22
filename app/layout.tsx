'use client';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '../styles/globals.css';

import {
  AppShell,
  Burger,
  ColorSchemeScript,
  Flex,
  Group,
  mantineHtmlProps,
  MantineProvider,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications';
import { ColorSchemeToggle } from '@/components/color-scheme-toggle';
import { Navbar } from '@/components/navbar/navbar';
import { theme } from '../styles/theme';

export default function RootLayout({ children }: { children: any }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <title>Griddle</title>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications />
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
                  <Text size="xl" lh={0} className="font-zen-dots uppercase">
                    Griddle
                  </Text>
                </Group>
                <Group align="center" h="100%" px="sm" gap="sm">
                  <ColorSchemeToggle />
                </Group>
              </Flex>
            </AppShell.Header>
            <AppShell.Navbar>
              <Navbar />
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
