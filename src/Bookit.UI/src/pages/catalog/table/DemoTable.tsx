import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {cx, DataRowOptions, useLazyDataSource, useTableState} from "@epam/uui-core";
import {LazyDataSourceApiRequest} from '@epam/uui';
import {DataTable, FlexRow, Text} from '@epam/promo';
import css from './DemoTable.module.scss';
import {getFilters} from './data';
import {getColumns} from './columns';
import {FilterPanel} from './FilterPanel';
import {InfoSidebarPanel} from './InfoSidebarPanel';
import {SlidingPanel} from './SlidingPanel';
import {FilterPanelOpener} from './FilterPanelOpener';
import {svc} from "../../../services";
import {MapObject, useBookingDbRef} from "../../../db";

export const DemoTable: React.FC = () => {
    const dbRef = useBookingDbRef();
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
    
    const dataSource = useLazyDataSource<MapObject, number, any>({
        api: async (request: LazyDataSourceApiRequest<MapObject, number, any>) => {
            const { range, filter, sorting, search } = request;
            
            return await dbRef.loadCatalogItems({
                filter,
                sorting,
                first: range!.count,
                after: `${range!.from - 1}`,
            })
        },
    }, []);
    
    const { current: rowOptions } = React.useRef<DataRowOptions<MapObject, number>>({
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
                data={ dataSource.getById(tableStateApi.tableState.selectedId) as MapObject }
                isVisible={ isInfoPanelOpened }
                onClose={ closeInfoPanel }
            />
        </div>
    );
};