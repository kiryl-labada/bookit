import { DbTable } from '@epam/uui-db';
import { BookingDbTables } from '../BookingDb';
import { Story } from '../models';

export const StoryTable = new DbTable<Story, number, BookingDbTables>({
    tableName: 'stories',
    typeName: 'Story',
    fields: {
        id: { isGenerated: true },
        __typename: { isClientOnly: true },
    },
    primaryKey: 'id',
});
