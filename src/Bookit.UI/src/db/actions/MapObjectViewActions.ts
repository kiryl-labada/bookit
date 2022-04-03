import { MapObjectView } from '../models';
import { Action } from './common';

const updateMapObjectView: Action<Partial<MapObjectView>> = (patch) => (db) => ({ mapObjectViews: [patch] });

export const mapObjectViewActions = {
    updateMapObjectView,
};
