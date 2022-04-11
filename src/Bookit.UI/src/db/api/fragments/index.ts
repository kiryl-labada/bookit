import { gql } from '@apollo/client';

export const storyFragment = gql`
    fragment storyFragment on Story {
        id
        name
    }
`;
