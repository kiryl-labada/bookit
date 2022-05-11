import { gql } from '@apollo/client';

export const getClientOrg = gql`
    query getClientOrg {
        clientOrgs {
            items {
                id
                name
                ownerId
                publicApiKey
                secretApiKey
                bookingConfirmUrl
                userMappingUrl
                serviceUrl
                servicePublicApiKey
                serviceSecretApiKey
            }
        }
    }
`;
