import { gql } from '@apollo/client';

export const getCatalogItems = gql`
    query getCatalogItems($first: Int, $after: String, $filter: InputMapObjectFilter, $sorting: [MapObjectSortingOption]) {
        catalogItems(first: $first, after: $after, filter: $filter, sorting: $sorting) {
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