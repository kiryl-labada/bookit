/* eslint-disable import/no-cycle */
import { DbTable, Db } from '@epam/uui-db';
import * as models from './models';
import { StoryTable, MapObjectTable, MapObjectViewTable, SlotTable, ClientOrgTable } from './tables';


export type BookingDbTables = {
    stories: DbTable<models.Story, number, BookingDbTables>;
    mapObjects: DbTable<models.MapObject, number, BookingDbTables>;
    mapObjectViews: DbTable<models.MapObjectView, number, BookingDbTables>;
    slots: DbTable<models.Slot, number, BookingDbTables>;
    clientOrgs: DbTable<models.ClientOrg, number, BookingDbTables>;
}

export const bookingDbTables: BookingDbTables = {
    stories: StoryTable,
    mapObjects: MapObjectTable,
    mapObjectViews: MapObjectViewTable,
    slots: SlotTable,
    clientOrgs: ClientOrgTable
};

export class BookingDb extends Db<BookingDbTables> {
    public get stories() { return this.tables.stories; }
    public get mapObjects() { return this.tables.mapObjects; }
    public get mapObjectViews() { return this.tables.mapObjectViews; }
    public get slots() { return this.tables.slots; }
    public get clientOrgs() { return this.tables.clientOrgs; }
}

export const blankBookingDb = new BookingDb(bookingDbTables);
