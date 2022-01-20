import { IProcessRequest } from '@epam/uui'; 
import { FetchResult } from '@apollo/client/link/core/types';


export interface GraphQLRequest {
    operationName?: string;
    query?: string;
    variables?: { [ key: string ] : any };
}

export function getApi(processRequest: IProcessRequest) {
    return {
        gql: {
            query<T = any>(request : { query: string, variables: any }) : Promise<FetchResult<T>> {
                return processRequest('/api/graphql/query', 'POST', request);
            },
        }
    };
}