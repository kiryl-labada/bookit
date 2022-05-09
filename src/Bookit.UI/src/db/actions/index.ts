import { bindActionSet } from './common';
import { storyActions } from './StoryActions';
import { mapObjectActions } from './MapObjectActions';
import { mapObjectViewActions } from './MapObjectViewActions';
import { slotActions } from './SlotActions';

export const bookingActions = {
    ...storyActions,
    ...mapObjectActions,
    ...mapObjectViewActions,
    ...slotActions,
};

const actions = bindActionSet(null as any, bookingActions);

export type BookingActions = typeof actions;
export * from './common';
