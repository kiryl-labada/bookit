import React from 'react';
import { useLocation } from 'react-router-dom';
import { urlParser } from '@epam/uui';
import { svc } from '../../services';

export function useUrlState<TUrlState>() {
    const location = useLocation();
    const params = urlParser.parse(location.search);

    const changeUrl = React.useCallback((urlState: TUrlState, replace?: boolean) => {
        const query = replace ? { ...urlState }
            : {
                ...urlParser.parse(location.search),
                ...urlState,
            };
        svc.uuiRouter.redirect({
            ...location,
            search: urlParser.stringify(query),
        });
    }, [location]);

    return [params, changeUrl];
}
