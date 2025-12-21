'use client';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import {
  AppShell,
  Burger,
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications';
import { Navbar } from '@/components/navbar/navbar';
import { theme } from '../theme';

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
            padding="md"
            header={{ height: 60 }}
            navbar={{
              width: 300,
              breakpoint: 'sm',
              collapsed: { mobile: !opened },
            }}
          >
            <AppShell.Header display="flex" px="md">
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <div>Griddle</div>
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
