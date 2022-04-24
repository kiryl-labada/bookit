import React, { useCallback } from 'react';
import { FilterConfig, ITableState } from "@epam/uui-core";
import { FlexRow, IconButton, ScrollBars, Text, FlexSpacer, Accordion } from '@epam/promo';
import { ReactComponent as CloseIcon } from '@epam/assets/icons/common/navigation-close-24.svg';
import { Filter } from './FIlter';

export interface IFilterPanelProps<TFilter extends Record<string, any>> extends ITableState {
    filters: FilterConfig<TFilter>[];
    closePanel(): void;
}

const FilterPanelI = <TFilter extends Record<string, any>>({ filters, closePanel, tableState: { filter }, setFilter }: IFilterPanelProps<TFilter>) => {
    const handleChange = useCallback((newFilter: TFilter) => {
        setFilter({
            ...filter,
            ...newFilter,
        });
    }, [filter]);
    
    return (
        <>
            <FlexRow borderBottom size='48' padding='18'>
                <Text fontSize='18'>Views</Text>
                <FlexSpacer/>
                <IconButton icon={ CloseIcon } onClick={ closePanel }/>
            </FlexRow>

            <ScrollBars>
                <Accordion title="Filters" mode="inline" padding="18">
                    { filters.map(f => {
                        return (
                            <Filter
                                { ...f }
                                value={ filter }
                                onValueChange={ handleChange }
                                columnKey={ f.columnKey }
                            />
                        );
                    }) }
                </Accordion>
            </ScrollBars>
        </>
    );
};

export const FilterPanel = React.memo(FilterPanelI);