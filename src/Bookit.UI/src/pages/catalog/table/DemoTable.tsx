import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DataRowOptions, cx, useLazyDataSource, useTableState } from "@epam/uui-core";
import { LazyDataSourceApi } from '@epam/uui';
import { DataTable, FlexRow, Text } from '@epam/promo';
import css from './DemoTable.module.scss';
import { getFilters } from './data';
import { getColumns } from './columns';
import { Person, PersonTableFilter, PersonTableRecord } from './types';
import { FilterPanel } from './FilterPanel';
import { InfoSidebarPanel } from './InfoSidebarPanel';
import { SlidingPanel } from './SlidingPanel';
import { FilterPanelOpener } from './FilterPanelOpener';
import {svc} from "../../../services";

const persons: Person[] = [
    { id: 1, name: 'A B', firstName: 'A', lastName: 'B', email: 'A@gmail.com', uid: 'A B', birthDate: new Date(), },
    { id: 2, name: 'C D', firstName: 'C', lastName: 'D', email: 'C@gmail.com', uid: 'C D', birthDate: new Date(), },
];

let id = 1;

const generatePersons = (count: number) => {
    let result = [];
    for (let i = 0; i < count; i++) {
        result.push({ ...persons[0], name: `Name ${id}`, id: id++ });
    }
    
    return result;
}

export const api: LazyDataSourceApi<PersonTableRecord, number, PersonTableFilter> = (request, ctx) => {
    console.log('r', request);
    const result = generatePersons(request.range?.count ?? 20);
    return Promise.resolve({
        items: result,
        count: 100,
    })
};

export const DemoTable: React.FC = () => {
    const [isFilterPanelOpened, setIsFilterPanelOpened] = useState(false);
    const [isInfoPanelOpened, setIsInfoPanelOpened] = useState(false);
    const closeInfoPanel = useCallback(() => setIsInfoPanelOpened(false), []);

    const filters = useMemo(getFilters, []);
    const columnsSet = useMemo(getColumns, []);

    useEffect(() => {
        svc.uuiRouter.redirect({ ...svc.uuiRouter.getCurrentLink(), query: {} })
    }, []);
    
    const tableStateApi = useTableState({
        columns: columnsSet,
    });
    
    const dataSource = useLazyDataSource<PersonTableRecord, number, PersonTableFilter>({
        api: api,
        getId: i => i.id,
    }, []);
    
    const { current: rowOptions } = React.useRef<DataRowOptions<PersonTableRecord, number>>({
        checkbox: { isVisible: true },
        isSelectable: true,
        onClick(rowProps) {
            rowProps?.onSelect && rowProps.onSelect(rowProps);
            setIsInfoPanelOpened(true);
        },
    });

    const personsDataView = dataSource.useView(tableStateApi.tableState, tableStateApi.setTableState, {
        rowOptions,
    });

    return (
        <div className={ css.wrapper }>
            <FilterPanelOpener
                isFilterPanelOpened={ isFilterPanelOpened }
                setIsFilterPanelOpened={ setIsFilterPanelOpened }
            />
            
            <SlidingPanel isVisible={ isFilterPanelOpened } width={ 288 } position="left">
                <FilterPanel
                    { ...tableStateApi }
                    filters={ filters }
                    closePanel={ () => setIsFilterPanelOpened(false) }
                />
            </SlidingPanel>

            <div className={ css.container }>
                <FlexRow
                    borderBottom
                    cx={ cx(css.presets, { [css.presetsWithFilter]: isFilterPanelOpened }) }
                >
                    <Text>Catalog</Text>
                </FlexRow>
                
                <DataTable
                    headerTextCase='upper'
                    getRows={ personsDataView.getVisibleRows }
                    columns={ columnsSet }
                    filters={ filters }
                    value={ tableStateApi.tableState }
                    onValueChange={ tableStateApi.setTableState }
                    showColumnsConfig={ true }
                    allowColumnsResizing
                    allowColumnsReordering
                    { ...personsDataView.getListProps() }
                />
            </div>
            
            <InfoSidebarPanel
                data={ dataSource.getById(tableStateApi.tableState.selectedId) as Person }
                isVisible={ isInfoPanelOpened }
                onClose={ closeInfoPanel }
            />
        </div>
    );
};