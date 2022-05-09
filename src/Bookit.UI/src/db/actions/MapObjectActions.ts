import { getTempId } from '@epam/uui-db';
import { InstanceType, MapObject, MapObjectType, MapObjectView, StateType } from '../models';
import { Action } from './common';


const updateMapObject: Action<Partial<MapObject>> = (patch) => (db) => ({ mapObjects: [patch] });

const createMapObject: Action<{ mapId: number, structure: string }> = ({ mapId, structure}) => (db) => {
    const now = new Date();
    const mapObject: Partial<MapObject> = {
        id: getTempId(), 
        name: 'New map object',
        prototypeId: null,
        instanceType: InstanceType.DRAFT,
        state: StateType.DRAFT,
        type: MapObjectType.PLACE,
        mapId: mapId,
        isDeleted: false,
        createdAt: now,
        updatedAt: now,
    };

    const mapObjectView: MapObjectView = {
        id: getTempId(),
        backgroundUrl: null,
        structure,
        createdAt: now,
        updatedAt: now,
        mapObjectId: mapObject.id!,
    };

    console.log('createMapObjectAction', mapObject);

    return { mapObjects: [mapObject], mapObjectViews: [mapObjectView] };
};

export const mapObjectActions = {
    updateMapObject,
    createMapObject,
};
