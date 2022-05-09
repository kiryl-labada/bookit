import { gql } from '@apollo/client';

export const getMapInfoQuery = gql`
    query getMapInfo($filter: InputMapObjectFilter) {
        mapObjects(filter: $filter) {
            items {
                id
                name
                instanceType
                state
                prototypeId
                isAdmin
                prototype {
                    id
                    instanceType
                }
            }
        }
    }
`;
