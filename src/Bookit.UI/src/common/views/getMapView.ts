import { BookingDb, MapObject } from "../../db";

export interface MapView {
    id: MapObject['id'];
    name: MapObject['name'];
    type: MapObject['type'];
    mapId: MapObject['mapId'];
    level: number;
    children: MapView[];
}

export const getMapView = (db: BookingDb, params: { mapId: number }): MapView => {
    const map = db.mapObjects.byId(params.mapId);
    const children = db.mapObjects.find({ mapId: params.mapId });

    return {
        ...mapObjectToMapView(map),
        level: 0,
        children: children.map((item) => ({ ...mapObjectToMapView(item), level: 1, children: [] }))
    };
};

function mapObjectToMapView(mapObject: MapObject) {
    return {
        id: mapObject.id,
        name: mapObject.name,
        type: mapObject.type,
        mapId: mapObject.mapId,
    };
}