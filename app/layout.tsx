import type { Metadata } from "next";
import "@/styles/globals.css";
import { Inter, Unna, Zen_Dots } from "next/font/google";
import { cn } from "@/utils/utils";
import { cookies } from "next/headers";
import { Notifications } from "@mantine/notifications";
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import { theme } from "../styles/theme";
import { Navbar } from "@/components/navbar/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const zenDots = Zen_Dots({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-zen-dots",
});

const unna = Unna({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-unna",
});

export const metadata: Metadata = {
  title: "Griddle",
  description: "Solve and generate nonogram puzzles online",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-serif antialiased",
          inter.variable,
          zenDots.variable,
          unna.variable
        )}
      >
        <MantineProvider
          theme={theme}
          withGlobalClasses
          withCssVariables
          defaultColorScheme="auto"
        >
          <Notifications />
          <Navbar />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
