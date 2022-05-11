import gql from 'graphql-tag';

export const createClientOrgMutation = gql`
    mutation createClientOrgMutation($payload: SubmitInputType) {
        submit(payload: $payload) {
            clientOrgs {
                id
                payload {
                    id
                    name
                    publicApiKey
                    secretApiKey
                    ownerId
                    bookingConfirmUrl
                    userMappingUrl
                    serviceUrl
                    servicePublicApiKey
                    serviceSecretApiKey
                }
            }
        }
    }
`;
