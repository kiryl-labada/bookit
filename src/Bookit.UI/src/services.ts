import { UuiContexts, ApiExtensions } from '@epam/uui';
import { IClientIdsMap } from '@epam/uui-db';
import { getApi } from './db/api';

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