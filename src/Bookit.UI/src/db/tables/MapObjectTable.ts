import { DbRelationType, DbTable } from '@epam/uui-db';
import { BookingDbTables } from '../BookingDb';
import { MapObject } from '../models';

export const MapObjectTable = new DbTable<MapObject, number, BookingDbTables>({
    tableName: 'mapObjects',
    typeName: 'MapObject',
    fields: {
        id: { isGenerated: true },
        parentId: {
            fk: {
                tableName: 'mapObjects',
                relationType: DbRelationType.Association,
            },
        },
        __typename: { isClientOnly: true },
    },
    primaryKey: 'id',
});