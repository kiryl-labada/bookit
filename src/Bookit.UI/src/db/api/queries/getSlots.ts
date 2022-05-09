import { gql } from '@apollo/client';

export const getSlotsQuery = gql`
    query getSlots($filter: InputSlotFilter) {
        slots(filter: $filter) {
            items {
                id
                from
                to
                mapObjectId
                bookedById
            }
        }
    }
`;
