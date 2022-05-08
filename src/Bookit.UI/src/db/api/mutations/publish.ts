import { gql } from '@apollo/client';
import { baseMapObjectFragment } from './../fragments/baseMapObjectFragment';

export const publishMutation = gql`
    mutation publish($payload: InputPublishPayload) {
        publish(payload: $payload) {
            payload {
                mapObjects {
                    id
                    payload {
                        ...baseMapObjectFragment
                    }
                }
            }
        }
    }
    ${baseMapObjectFragment}
`;
