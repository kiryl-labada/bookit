import { gql } from '@apollo/client';

export const getCatalogItems = gql`
    query getCatalogItems($first: Int, $after: String, $filter: InputMapObjectFilter) {
        catalogItems(first: $first, after: $after, filter: $filter) {
            items {
                id
                name
                mapId
                state
                type
                createdAt
                updatedAt
                isDeleted
            }
            totalCount
        }
    }
`;