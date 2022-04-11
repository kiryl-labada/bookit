import { DbRef, flattenResponse, DbPatch, useDbRef, DbSaveResponse } from '@epam/uui-db';
import { DocumentNode } from 'graphql';
import { print } from 'graphql/language/printer';
import { FetchResult } from '@apollo/client';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { blankBookingDb, BookingDb, BookingDbTables } from './BookingDb';
import { svc } from '../services';
import { patchMutation } from './api';
import { bindActionSet, bookingActions, BookingActions } from './actions';
import { getMapQuery } from './api/queries/getMap';

export interface FetchState {
    isLoading: boolean;
    isLoaded: boolean;
    promise: Promise<any>;
    reload: () => void;
}

export class BookingDbRef extends DbRef<BookingDbTables, BookingDb> {
    public readonly actions: BookingActions;

    constructor() {
        super(blankBookingDb);
        this.actions = bindActionSet(this, bookingActions);
    }

    private fetchCache: Map<DocumentNode, Map<string, FetchState>> = new Map();

    public fetchGQL(
        query: DocumentNode,
        variables: any,
        postProcess?: (result: DbPatch<BookingDbTables>) => void,
    ) : FetchState {
        let queryCache = this.fetchCache.get(query);
        if (!queryCache) {
            queryCache = new Map();
            this.fetchCache.set(query, queryCache);
        }

        const variablesKey = JSON.stringify(variables);

        let state = queryCache.get(variablesKey);
        const document = print(addTypenameToDocument(query));

        if (!state) {
            const reload = () => {
                if (!state!.isLoading) {
                    state!.isLoading = true;
                    svc.api.gql.query({ query: document, variables }).then((result) => {
                        const flatten = flattenResponse(result, blankBookingDb.tables);
                        state!.isLoading = false;
                        this.commitFetch(flatten);
                        postProcess && postProcess(flatten);
                    });
                }
            };
            const promise = svc.api.gql.query({ query: document, variables }).then((result: any) => {
                const flatten = flattenResponse(result, blankBookingDb.tables);
                state!.isLoaded = true;
                state!.isLoading = false;
                this.commitFetch(flatten);
                postProcess && postProcess(flatten);
                return result.data;
            });

            state = { isLoaded: false, isLoading: true, promise, reload };
            queryCache.set(variablesKey, state);
        }
        return state;
    }

    public async mutateGQL<T = any>(
        mutation: DocumentNode,
        variables: any,
        option?: { errorHandling?: 'manual' | 'page' | 'notification' },
    ) : Promise<FetchResult<T>> {
        const document = print(addTypenameToDocument(mutation));
        const result = await svc.api
            .withOptions(option || {})
            .gql.query({ query: document, variables });
        const flatten = flattenResponse(result, blankBookingDb.tables);
        this.commitFetch(flatten);
        return result;
    }

    protected savePatch(patch: DbPatch<BookingDbTables>): Promise<DbSaveResponse<BookingDbTables>> {
        const document = print(addTypenameToDocument(patchMutation));
        return svc.api.gql.query({
            query: document, 
            variables: { payload: patch },
        }).then((r) => r.data);
    }

    fetchMap() {
        return this.fetchGQL(getMapQuery, {});
    }
}


export const useBookingDbRef = () => useDbRef<BookingDbRef>();
