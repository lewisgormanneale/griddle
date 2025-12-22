'use client';

import { createTheme, DEFAULT_THEME } from '@mantine/core';
import { Inter, Unna, Zen_Dots } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const zenDots = Zen_Dots({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-zen-dots',
});

const unna = Unna({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-unna',
});

export const theme = createTheme({
  fontFamily: inter.style.fontFamily,
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    // Use default theme if you want to provide default Mantine fonts as a fallback
    fontFamily: `${unna.style.fontFamily}, ${DEFAULT_THEME.fontFamily}`,
  },
  /* Put your mantine theme override here */
});
