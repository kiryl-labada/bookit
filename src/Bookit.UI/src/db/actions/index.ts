import { bindActionSet } from './common';
import { storyActions } from './StoryActions';

export const bookingActions = {
    ...storyActions
};

const actions = bindActionSet(null as any, bookingActions);

export type BookingActions = typeof actions;
export * from './common';
