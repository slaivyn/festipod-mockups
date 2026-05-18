import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { WelcomeScreen } from './WelcomeScreen';
import { withProviders } from '../../../../.storybook/decorators';

const meta: Meta<typeof WelcomeScreen> = {
  title: 'Screens/Auth/WelcomeScreen',
  component: WelcomeScreen,
  decorators: [withProviders],
};
export default meta;

type Story = StoryObj<typeof WelcomeScreen>;

export const Default: Story = {};
