import { gql } from '@apollo/client';

export const getMapQuery = gql`
    query getMap {
        mapObjects {
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
                }
            }
        }
    }
`;
