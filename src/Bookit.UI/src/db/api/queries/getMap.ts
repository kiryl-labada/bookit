import { gql } from '@apollo/client';

export const getMapQuery = gql`
    query getMap($filter: InputMapObjectFilter) {
        mapObjects(filter: $filter) {
            items {
                id
                name
                mapId
                state
                type
                createdAt
                updatedAt
                isDeleted
                view {
                    id
                    backgroundUrl
                    structure
                    createdAt
                    updatedAt
                    mapObjectId
                }
            }
        }
    }
`;
