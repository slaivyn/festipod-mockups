import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { FriendsListScreen } from './FriendsListScreen';
import { withProviders } from '../../../../.storybook/decorators';

const meta: Meta<typeof FriendsListScreen> = {
  title: 'Screens/User/FriendsListScreen',
  component: FriendsListScreen,
  decorators: [withProviders],
};
export default meta;

type Story = StoryObj<typeof FriendsListScreen>;

export const Default: Story = {};
