import { gql } from '@apollo/client';
import { baseMapObjectFragment } from '../fragments';

export const getMapQuery = gql`
    query getMap($filter: InputMapObjectFilter) {
        mapObjects(filter: $filter) {
            items {
                ...baseMapObjectFragment
            }
        }
    }
    ${baseMapObjectFragment}
`;
