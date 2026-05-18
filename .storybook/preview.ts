import type { Preview } from '@storybook/react-webpack5'
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
    layout: 'fullscreen',
  },
};

export default preview;
