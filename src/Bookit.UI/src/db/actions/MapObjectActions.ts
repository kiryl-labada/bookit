import { getTempId } from '@epam/uui-db';
import { MapObject } from '../models';
import { Action } from './common';


const updateMapObject: Action<Partial<MapObject>> = (patch) => (db) => ({ mapObjects: [patch] });

const createMapObject: Action<Partial<MapObject>> = (m) => (db) => {
    const id = m.id || getTempId();
    const item = {
        id,
        name: m.name
    };

    return { mapObjects: [item] };
};

export const mapObjectActions = {
    updateMapObject,
    createMapObject,
};
