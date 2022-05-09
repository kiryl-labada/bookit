import gql from 'graphql-tag';

export const patchMutation = gql`
    mutation patchMutation($payload: SubmitInputType) {
        submit(payload: $payload) {
            mapObjects {
                id
                payload {
                    id
                    name
                    mapId
                    state
                    type
                    createdAt
                    updatedAt
                    isDeleted
                }
            }
            mapObjectViews {
                id
                payload {
                    id
                    backgroundUrl
                    structure
                    createdAt
                    updatedAt
                    mapObjectId
                }
            }
            slots {
                id
                payload {
                    id
                    from
                    to
                    mapObjectId
                    bookedById
                }
            }
        }
    }
`;
