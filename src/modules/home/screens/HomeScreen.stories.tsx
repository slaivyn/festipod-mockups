import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { HomeScreen } from './HomeScreen';
import { withProviders } from '../../../../.storybook/decorators';

const meta: Meta<typeof HomeScreen> = {
  title: 'Screens/Home/HomeScreen',
  component: HomeScreen,
  decorators: [withProviders],
};
export default meta;

type Story = StoryObj<typeof HomeScreen>;

export const Default: Story = {};
