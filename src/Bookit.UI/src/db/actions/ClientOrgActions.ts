import { ClientOrg } from '../models';
import { Action } from './common';


const updateClientOrg: Action<Partial<ClientOrg>> = (patch) => (db) => ({ clientOrgs: [patch] });

export const clientOrgActions = {
    updateClientOrg,
};
