/* eslint-disable import/no-cycle */
import { DbTable, Db } from '@epam/uui-db';
import * as models from './models';
import { StoryTable, MapObjectTable } from './tables';


export type BookingDbTables = {
    stories: DbTable<models.Story, number, BookingDbTables>;
    mapObjects: DbTable<models.MapObject, number, BookingDbTables>;
}

export const bookingDbTables: BookingDbTables = {
    stories: StoryTable,
    mapObjects: MapObjectTable,
};

export class BookingDb extends Db<BookingDbTables> {
    public get stories() { return this.tables.stories; }
    public get mapObjects() { return this.tables.mapObjects; }
}

export const blankBookingDb = new BookingDb(bookingDbTables);
