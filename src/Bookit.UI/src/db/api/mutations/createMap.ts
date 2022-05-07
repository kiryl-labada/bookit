import { gql } from '@apollo/client';

export const createMapMutation = gql`
    mutation createMap($payload: InputCreateMapPayload) {
        createMap(payload: $payload) {
            data {
                draftMapId
                originalMapId
            }
        }
    }
`;
