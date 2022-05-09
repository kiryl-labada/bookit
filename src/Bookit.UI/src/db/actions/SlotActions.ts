import { SlotStatus } from './../models';
import { getTempId } from '@epam/uui-db';
import { Slot } from '../models';
import { Action } from './common';

const createSlot: Action<{ mapObjectId: number, from: Date, to: Date }> = ({ mapObjectId, from, to }) => (db) => {
    const slot: Slot = {
        id: getTempId(),
        from,
        to,
        status: SlotStatus.AVAILABLE,
        mapObjectId,
        bookedById: null,
    };

    return { slots: [slot] };
};


export const slotActions = {
    createSlot,
};
