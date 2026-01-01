'use client';

import { MantineProvider } from '@mantine/core';
import { render, type RenderOptions } from '@testing-library/react';

type ProviderProps = {
  children: React.ReactNode;
};

function Providers({ children }: ProviderProps) {
  return <MantineProvider>{children}</MantineProvider>;
}

export function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: Providers, ...options });
}
