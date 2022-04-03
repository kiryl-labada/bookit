/* eslint-disable import/no-cycle */
import { DbTable, Db } from '@epam/uui-db';
import * as models from './models';
import { StoryTable, MapObjectTable, MapObjectViewTable } from './tables';


export type BookingDbTables = {
    stories: DbTable<models.Story, number, BookingDbTables>;
    mapObjects: DbTable<models.MapObject, number, BookingDbTables>;
    mapObjectViews: DbTable<models.MapObjectView, number, BookingDbTables>;
}

export const bookingDbTables: BookingDbTables = {
    stories: StoryTable,
    mapObjects: MapObjectTable,
    mapObjectViews: MapObjectViewTable,
};

export class BookingDb extends Db<BookingDbTables> {
    public get stories() { return this.tables.stories; }
    public get mapObjects() { return this.tables.mapObjects; }
    public get mapObjectViews() { return this.tables.mapObjectViews; }
}

export const blankBookingDb = new BookingDb(bookingDbTables);
