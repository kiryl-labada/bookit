import { DbPatch, objectKeys } from '@epam/uui-db';
import { BookingDbRef } from '../BookingDbRef';
import { BookingDb, BookingDbTables } from '../BookingDb';


export type Action<T> = (payload: T, params?: any) => (db: BookingDb) => DbPatch<BookingDbTables>;

export type BoundAction<T> = (payload: T, params?: any) => void;

export function bindAction<T>(dbRef: BookingDbRef, action: Action<T>): BoundAction<T> {
    return (payload: T, params?: any) => {
        const patch = action(payload, params)(dbRef.db);
        dbRef.commit(patch);
    };
}

export type ActionsSet<TActionSet> = { [TName in keyof TActionSet]: Action<TActionSet[TName]> };
export type BoundActionsSet<TActionSet> = { [TName in keyof TActionSet]: BoundAction<TActionSet[TName]> };

export function bindActionSet<TActions>(dbRef: BookingDbRef, actions: ActionsSet<TActions>): BoundActionsSet<TActions> {
    const result: any = {};
    objectKeys(actions).forEach((actionName) => {
        result[actionName] = bindAction(dbRef, actions[actionName]);
    });
    return result;
}
