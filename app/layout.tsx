import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '../styles/globals.css';

import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import { AppShellLayout } from '@/components/layout/app-shell-layout';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <Providers>
          <AppShellLayout>{children}</AppShellLayout>
        </Providers>
      </body>
    </html>
  );
}
