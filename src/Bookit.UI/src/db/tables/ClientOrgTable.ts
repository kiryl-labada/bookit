import { DbTable } from '@epam/uui-db';
import { BookingDbTables } from '../BookingDb';
import { ClientOrg } from '../models';

export const ClientOrgTable = new DbTable<ClientOrg, number, BookingDbTables>({
    tableName: 'clientOrgs',
    typeName: 'ClientOrg',
    fields: {
        id: { isGenerated: true },
        publicApiKey: { isClientOnly: true },
        secretApiKey: { isClientOnly: true },
        __typename: { isClientOnly: true },
    },
    primaryKey: 'id',
});
