import { baseSlotFragment } from './../fragments/baseSlotFragment';
import { gql } from '@apollo/client';

export const getSlotsQuery = gql`
    query getSlots($filter: InputSlotFilter) {
        slots(filter: $filter) {
            items {
                ...baseSlotFragment
            }
        }
    }
    ${baseSlotFragment}
`;
