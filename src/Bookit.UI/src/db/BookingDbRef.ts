import { publishMutation } from './api/mutations/publish';
import { getMapInfoQuery } from './api/queries/getMapInfo';
import { createMapMutation } from './api/mutations/createMap';
import { DbRef, flattenResponse, DbPatch, useDbRef, DbSaveResponse } from '@epam/uui-db';
import { DocumentNode } from 'graphql';
import { print } from 'graphql/language/printer';
import {FetchResult, QueryOptions} from '@apollo/client';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { blankBookingDb, BookingDb, BookingDbTables } from './BookingDb';
import { svc } from '../services';
import {getCatalogItems, patchMutation} from './api';
import { bindActionSet, bookingActions, BookingActions } from './actions';
import { getMapQuery } from './api/queries/getMap';
import {CatalogItemFilter, Connection, MapObject} from "./models";

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


    public loadGQL<T = any>(options: QueryOptions<any>) {
        const document = print(addTypenameToDocument(options.query));

        return svc.api.gql.query<T>({ query: document, variables: options.variables }).then((result) => {
            const flatten = flattenResponse(result, blankBookingDb.tables);
            this.commitFetch(flatten);
            return {
                ...result,
                flatten,
            };
        });
    }
    
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

    public fetchMap(id: number) {
        return this.fetchGQL(getMapQuery, { filter: { or: [ { id: { eq: id } }, { mapId: { eq: id } } ] } });
    }

    public fetchMapInfo(id: number) {
        return this.fetchGQL(getMapInfoQuery, { filter: { id: { eq: id } } });
    }
    
    public loadCatalogItems(filter?: { first?: number, after?: string, search?: string, sorting?: any, filter?: CatalogItemFilter }) {
        return this.loadGQL<{ catalogItems: Connection<MapObject> }>({ query: getCatalogItems, variables: filter }).then((res) => ({
            items: res.data!.catalogItems.items,
            count: res.data!.catalogItems.totalCount,
        }));
    }

    public createMap(name: string, backgroundUrl: string) {
        return this.mutateGQL(createMapMutation, { payload: { input: { name, backgroundUrl } } }).then((res) => ({
            originalMapId: res.data.createMap.data.originalMapId,
            draftMapId: res.data.createMap.data.draftMapId,
        }));
    }

    public publish(mapId: number) {
        return this.mutateGQL(publishMutation, { payload: { mapId } });
    }
}


export const useBookingDbRef = () => useDbRef<BookingDbRef>();
