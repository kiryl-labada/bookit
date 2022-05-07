import { IProcessRequest } from '@epam/uui'; 
import { FetchResult } from '@apollo/client/link/core/types';
import { AppContext } from '../models';
import { getAppContext } from './queries/getAppContext';

export interface GraphQLRequest {
    operationName?: string;
    query?: string;
    variables?: { [ key: string ] : any };
}

export function getApi(processRequest: IProcessRequest) {
    const gqlQuery = (request: any) => processRequest('/api/graphql/query', 'POST', request) as Promise<any>;

    return {
        gql: {
            query<T = any>(request : { query: string, variables: any }) : Promise<FetchResult<T>> {
                return gqlQuery(request);
            },
        },
        loadAppContext() {
            return gqlQuery({ query: getAppContext })
                .then((res: any) => res.data.appContext) as Promise<AppContext>;
        },
    };
}