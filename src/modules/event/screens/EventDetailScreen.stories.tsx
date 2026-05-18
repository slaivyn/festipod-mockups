import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { EventDetailScreen } from './EventDetailScreen';
import { withProviders } from '../../../../.storybook/decorators';

const meta: Meta<typeof EventDetailScreen> = {
  title: 'Screens/Event/EventDetailScreen',
  component: EventDetailScreen,
  decorators: [withProviders],
};
export default meta;

type Story = StoryObj<typeof EventDetailScreen>;

export const Default: Story = {};
