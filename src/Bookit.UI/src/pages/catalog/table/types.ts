import { DataTableState, ITablePreset } from "@epam/uui";

interface TableState extends DataTableState {
    isFolded?: boolean;
    presets?: ITablePreset[];
}

export type { TableState };