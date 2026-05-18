import React from 'react';
import type { Decorator } from '@storybook/react-webpack5';
import { ThemeProvider } from '../src/shared/context/ThemeContext';
import { NextGraphProvider } from '../src/shared/context/NextGraphContext';
import { FestipodDataProvider } from '../src/shared/context/FestipodDataContext';
import { RouterProvider } from '../src/app/router';

export const withProviders: Decorator = (Story) => (
  <ThemeProvider>
    <NextGraphProvider>
      <FestipodDataProvider>
        <RouterProvider>
          <div style={{ maxWidth: 375, margin: '0 auto', height: '100vh', background: 'var(--sketch-white)' }}>
            <Story />
          </div>
        </RouterProvider>
      </FestipodDataProvider>
    </NextGraphProvider>
  </ThemeProvider>
);
