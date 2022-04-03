

export interface Story {
    id: number;
    name: string;
    __typename?: 'Story';
}

export enum MapObjectType {
    MAP = 'MAP',
    PLACE = 'PLACE',
}

export enum StateType {
    Draft = 'Draft',
    Published = 'Published',
    Archived = 'Archived',
}

export interface MapObject {
    id: number;
    name: string | null;
    mapId: number | null;
    state: StateType;
    type: MapObjectType;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    __typename?: 'MapObject';
}

export interface MapObjectView {
    id: number;
    structure: string | null;
    backgroundUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    __typename?: 'MapObjectView';
}