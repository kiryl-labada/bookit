import { gql } from '@apollo/client';

export const baseMapObjectViewFragment = gql`
    fragment baseMapObjectViewFragment on MapObjectView {
        id
        backgroundUrl
        structure
        createdAt
        updatedAt
        mapObjectId
    }
`;
