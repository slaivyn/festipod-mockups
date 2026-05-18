import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { EventsScreen } from './EventsScreen';
import { withProviders } from '../../../../.storybook/decorators';

const meta: Meta<typeof EventsScreen> = {
  title: 'Screens/Event/EventsScreen',
  component: EventsScreen,
  decorators: [withProviders],
};
export default meta;

type Story = StoryObj<typeof EventsScreen>;

export const Default: Story = {};
