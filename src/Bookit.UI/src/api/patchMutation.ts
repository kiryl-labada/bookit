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
        }
    }

    ${storyFragment}
`;
