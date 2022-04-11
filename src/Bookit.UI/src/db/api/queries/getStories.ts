import { gql } from '@apollo/client';

export const getStoriesQuery = gql`
    query getStories {
        stories {
            items {
                id
                name
            }
        }
    }
`;
