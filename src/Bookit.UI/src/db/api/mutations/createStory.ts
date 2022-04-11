import { gql } from '@apollo/client';

export const createStoryMutation = gql`
    mutation createStory($payload: SubmitInputType) {
        submit(payload: $payload) {
            stories {
                id
                payload {
                    id
                    name
                }
            }
        }
    }
`;
