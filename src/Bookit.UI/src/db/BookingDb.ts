/* eslint-disable import/no-cycle */
import { DbTable, Db } from '@epam/uui-db';
import * as models from './models';
import { StoryTable } from './tables';


export type BookingDbTables = {
    stories: DbTable<models.Story, number, BookingDbTables>;
}

export const bookingDbTables: BookingDbTables = {
    stories: StoryTable,
};

export class BookingDb extends Db<BookingDbTables> {
    public get stories() { return this.tables.stories; }
}

export const blankBookingDb = new BookingDb(bookingDbTables);
