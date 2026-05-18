import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { SettingsScreen } from './SettingsScreen';
import { withProviders } from '../../../../.storybook/decorators';

const meta: Meta<typeof SettingsScreen> = {
  title: 'Screens/Home/SettingsScreen',
  component: SettingsScreen,
  decorators: [withProviders],
};
export default meta;

type Story = StoryObj<typeof SettingsScreen>;

export const Default: Story = {};
