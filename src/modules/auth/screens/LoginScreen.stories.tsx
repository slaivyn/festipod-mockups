import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { LoginScreen } from './LoginScreen';
import { withProviders } from '../../../../.storybook/decorators';

const meta: Meta<typeof LoginScreen> = {
  title: 'Screens/Auth/LoginScreen',
  component: LoginScreen,
  decorators: [withProviders],
};
export default meta;

type Story = StoryObj<typeof LoginScreen>;

export const Default: Story = {};
