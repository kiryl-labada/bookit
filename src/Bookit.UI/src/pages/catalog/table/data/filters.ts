import { FilterConfig } from "@epam/uui-core";

export const getFilters = <TFilter extends Record<string, any>>(): FilterConfig<TFilter>[] => {
    return [
        {
            field: "birthDate",
            columnKey: "birthDate",
            title: "Birth Date",
            type: "rangeDatePicker",
        },
    ];
};