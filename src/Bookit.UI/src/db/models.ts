

export interface Story {
    id: number;
    name: string;
    __typename?: 'Story';
}

export enum MapObjectType {
    MAP = 'MAP',
    PLACE = 'PLACE',
}

export interface MapObject {
    id: number;
    parentId: number | null;
    name: string;
    type: MapObjectType;
    children: MapObject[];
    structureJson: string;
    background: string | null;
    modifiedAt: Date;
    __typename?: 'MapObject';
}