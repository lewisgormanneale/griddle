import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '../styles/globals.css';

import type { Metadata } from 'next';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import { AppShellLayout } from '@/components/layout/app-shell-layout';
import { zenDots } from '@/styles/fonts';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    template: '%s | Griddle',
    default: 'Griddle',
  },
  description: 'Create, play, and share nonogram puzzles online.',
  metadataBase: new URL('https://griddle.lewisgormanneale.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={zenDots.variable} {...mantineHtmlProps}>
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <ColorSchemeScript />
      </head>
      <body>
        <Providers>
          <AppShellLayout>{children}</AppShellLayout>
        </Providers>
      </body>
    </html>
  );
}
