import { bindActionSet } from './common';
import { storyActions } from './StoryActions';
import { mapObjectActions } from './MapObjectActions';
import { mapObjectViewActions } from './MapObjectViewActions';

export const bookingActions = {
    ...storyActions,
    ...mapObjectActions,
    ...mapObjectViewActions,
};

const actions = bindActionSet(null as any, bookingActions);

export type BookingActions = typeof actions;
export * from './common';
