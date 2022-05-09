import { DbRelationType, DbTable } from '@epam/uui-db';
import { BookingDbTables } from '../BookingDb';
import { Slot } from '../models';

export const SlotTable = new DbTable<Slot, number, BookingDbTables>({
    tableName: 'slots',
    typeName: 'Slot',
    fields: {
        id: { isGenerated: true },
        mapObjectId: {
            fk: {
                tableName: 'mapObjects',
                relationType: DbRelationType.Association,
            },
        },
        __typename: { isClientOnly: true },
    },
    primaryKey: 'id',
});
