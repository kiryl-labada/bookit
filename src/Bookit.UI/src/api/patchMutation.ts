import gql from 'graphql-tag';

import { storyFragment } from './fragments';

export const patchMutation = gql`
    mutation patchMutation($payload: SubmitInputType) {
        submit(payload: $payload) {
            stories {
                id
                payload {
                    ...storyFragment
                }
            }
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
                }
            }
        }
    }

    ${storyFragment}
`;
