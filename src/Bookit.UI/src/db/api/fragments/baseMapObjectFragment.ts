import { gql } from '@apollo/client';

export const baseMapObjectFragment = gql`
    fragment baseMapObjectFragment on MapObject {
        id
        name
        mapId
        state
        type
        instanceType
        prototypeId
        createdAt
        updatedAt
        isDeleted
        view {
            id
            backgroundUrl
            structure
            createdAt
            updatedAt
            mapObjectId
        }
    }
`;
