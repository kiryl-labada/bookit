import { UuiContexts, CommonContexts as UuiCommonContext, ApiExtensions } from '@epam/uui';
import { IClientIdsMap } from '@epam/uui-db';
import { getApi, GraphQLRequest } from './api';
import { BookingDbRef } from './db';

const tApi = getApi({} as any);
export type Api = typeof tApi;

export interface CommonContexts {
    api: Api & ApiExtensions<Api>;
    history: History;
    idMap: IClientIdsMap;
}

export interface SandboxServices extends Readonly<UuiContexts>, Readonly<CommonContexts> {
}

export const svc: SandboxServices = {} as any;