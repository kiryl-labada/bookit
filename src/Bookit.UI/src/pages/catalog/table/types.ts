import { DataTableState, ITablePreset } from "@epam/uui";

interface TableState extends DataTableState {
    isFolded?: boolean;
    presets?: ITablePreset[];
}

interface Person {
    id: number;
    uid: string;
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
}

type PersonTableRecord = Person;

type PersonTableFilter = { [key: string]: any };

export type { TableState, Person, PersonTableRecord, PersonTableFilter };