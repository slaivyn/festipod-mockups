import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { CreateEventScreen } from './CreateEventScreen';
import { withProviders } from '../../../../.storybook/decorators';

const meta: Meta<typeof CreateEventScreen> = {
  title: 'Screens/Event/CreateEventScreen',
  component: CreateEventScreen,
  decorators: [withProviders],
};
export default meta;

type Story = StoryObj<typeof CreateEventScreen>;

export const Default: Story = {};
