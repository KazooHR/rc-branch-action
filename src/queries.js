CREATE_TAG_MUTATION = `
  mutation($clientId: String!, $refName: String!, $commitOid: GitObjectID!, $repositoryId: ID! ) {
    createRef( input:{ clientMutationId: $clientId, name: $refName, oid: $commitOid, repositoryId: $repositoryId } ) {
      clientMutationId
      ref {
        id
        name
        prefix
      }
    }
  }
`;

GET_REFS_QUERY = `
  query($owner: String!, $repoName: String!, $queryStr: String!) {
    repository(name: $repoName owner: $owner) {
      id
      refs(refPrefix: "refs/" first: 100 query: $queryStr orderBy: { field: TAG_COMMIT_DATE, direction: ASC } ) {
        nodes {
          name
          target {
            oid
          }
        }
      }
    }
  }
`;

exports.CREATE_TAG_MUTATION = CREATE_TAG_MUTATION;
exports.GET_REFS_QUERY = GET_REFS_QUERY;
