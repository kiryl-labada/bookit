import { gql } from '@apollo/client';

export const getStories = gql`
    query getStories {
        stories {
            items {
                id
                name
            }
        }
    }
`;
