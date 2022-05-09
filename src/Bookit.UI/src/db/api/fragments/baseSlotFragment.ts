import { gql } from '@apollo/client';

export const baseSlotFragment = gql`
    fragment baseSlotFragment on Slot {
        id
        from
        to
        status
        mapObjectId
        bookedById
    }
`;
