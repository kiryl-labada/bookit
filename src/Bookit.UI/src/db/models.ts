export interface InFilter<T> {
    in?: T[];
    nin?: T[];
    eq?: T;
    neq?: T;
    isNull?: boolean;
}

export interface ComparisonsFilter<T> extends InFilter<T> {
    gt?: T;
    lt?: T;
    gte?: T;
    lte?: T;
}

export interface CompoundFilter<TFilter> {
    not?: TFilter;
    and?: TFilter[];
    or?: TFilter[];
}

export interface Connection<T> {
    items: T[];
    totalCount?: number;
}

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
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

export enum InstanceType {
    DRAFT = 'DRAFT',
    ORIGINAL = 'ORIGINAL',
}

export interface MapObject {
    id: number;
    name: string | null;
    mapId: number | null;
    state: StateType;
    instanceType: InstanceType;
    prototypeId: number | null;
    type: MapObjectType;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    isAdmin: boolean;
    __typename?: 'MapObject';
}

export interface MapObjectView {
    id: number;
    structure: string | null;
    backgroundUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    mapObjectId: number;
    __typename?: 'MapObjectView';
}

export enum MapPageTab {
    MAP = 'MAP',
    BUILDER = 'BUILDER',
    DASHBOARD = 'DASHBOARD',
}

export interface CatalogItemFilter extends CompoundFilter<CatalogItemFilter> {
    userId?: InFilter<number>;
}

export interface AppContext {
    user: {
        id: string;
        name: string;
        email: string;
        clientOrgId: number | null;
    }
}

export enum SlotStatus {
    AVAILABLE = 'AVAILABLE',
    BOOKED = 'BOOKED',
}

export interface Slot {
    id: number;
    from: Date;
    to: Date;
    status: SlotStatus;
    mapObjectId: number;
    bookedById: string | null;
    __typename?: 'Slot';
}

export interface ClientOrg {
    id: number;
    name: string;
    ownerId: string;
    publicApiKey: string;
    secretApiKey: string;
    bookingConfirmUrl: string;
    userMappingUrl: string;
    serviceUrl: string;
    servicePublicApiKey: string;
    serviceSecretApiKey: string;
    __typename?: 'ClientOrg';
}
