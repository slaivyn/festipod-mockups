import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ProfileScreen } from './ProfileScreen';
import { withProviders } from '../../../../.storybook/decorators';

const meta: Meta<typeof ProfileScreen> = {
  title: 'Screens/User/ProfileScreen',
  component: ProfileScreen,
  decorators: [withProviders],
};
export default meta;

type Story = StoryObj<typeof ProfileScreen>;

export const Default: Story = {};
