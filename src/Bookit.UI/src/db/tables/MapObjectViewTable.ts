import { DbRelationType, DbTable } from '@epam/uui-db';
import { BookingDbTables } from '../BookingDb';
import { MapObjectView } from '../models';

export const MapObjectViewTable = new DbTable<MapObjectView, number, BookingDbTables>({
    tableName: 'mapObjectViews',
    typeName: 'MapObjectView',
    fields: {
        id: {
            fk: {
                tableName: 'mapObjects',
                relationType: DbRelationType.Association,
            }, 
        },
        __typename: { isClientOnly: true },
    },
    primaryKey: 'id',
});
