import { baseSlotFragment } from './../fragments/baseSlotFragment';
import { gql } from '@apollo/client';

export const bookPlaceMutation = gql`
    mutation bookPlace($payload: InputBookPayload) {
        book(payload: $payload) {
            data {
                isSuccess
            }
            payload {
                slots {
                    id
                    payload {
                        ...baseSlotFragment
                    }
                }
            }
        }
    }
    ${baseSlotFragment}
`;
