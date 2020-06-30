const core = require("@actions/core");
const { graphql } = require("@octokit/graphql");

const { getBaseTagNode, zeroPad } = require("./helpers");
const { CREATE_TAG_MUTATION, GET_REFS_QUERY } = require("./queries");

// Needed as an identifer for creating references via the GraphQL API
// https://developer.github.com/v4/mutation/createref/
const CLIENT_ID = `kazoohr/rc-branch-action`;

async function createNewTag(token, tagName, commitOid, repositoryId) {
  return graphql(CREATE_TAG_MUTATION, {
    clientId: CLIENT_ID,
    refName: `refs/tags/${tagName}`,
    commitOid,
    repositoryId,
    headers: {
      authorization: `token ${token}`,
    },
  });
}

async function getBranchRefs(token, owner, repoName, queryStr) {
  return graphql(GET_REFS_QUERY, {
    owner,
    repoName,
    queryStr,
    headers: {
      authorization: `token ${token}`,
    },
  });
}

if (!process.env.GITHUB_REF) {
  console.error("Missing GITHUB_REPOSITORY");
  return;
}

if (!process.env.GITHUB_REPOSITORY) {
  console.error("Missing GITHUB_REPOSITORY");
  return;
}

if (!process.env.GITHUB_TOKEN) {
  console.error("Missing GITHUB_TOKEN");
  return;
}

const branchName = process.env.GITHUB_REF.split("/").pop();
const [owner, repoName] = process.env.GITHUB_REPOSITORY.split("/");
const token = process.env.GITHUB_TOKEN;

if (!owner || !repoName) {
  console.error("Invalid GITHUB_REPOSITORY value");
  return;
}

getBranchRefs(token, owner, repoName, branchName)
  .then((data) => {
    const repositoryId = data.repository.id;
    const tagNodes = data.repository.refs.nodes.filter((node) =>
      node.name.startsWith("tags")
    );
    const lastTagNode = tagNodes.pop() || getBaseTagNode(branchName);

    const branchNodes = data.repository.refs.nodes.filter(
      (node) => node.name === `heads/${branchName}`
    );
    const branchNode = branchNodes.pop();
    if (!branchNode) {
      throw new Error("No matching branch name found in graphql response.");
    }

    const lastTag = lastTagNode.name.split("/").pop();
    const lastPatch = parseInt(lastTag.split("-").pop());
    const newTag = branchName.concat("-").concat(zeroPad(lastPatch + 1, 3));

    const branchOid = branchNode.target.oid;
    const lastTagOid = lastTagNode.target.oid;

    if (lastTagOid !== null && branchOid === lastTagOid) {
      throw new Error(
        "No new branch commits. Cowardly refusing to create a new tag."
      );
    }
    return createNewTag(token, newTag, branchOid, repositoryId);
  })
  .then((data) => {
    const newTag = data.createRef.ref.name;
    const newRefId = data.createRef.ref.id;
    core.setOutput(`Tag created: ${newTag} with ref id ${newRefId}`);
  })
  .catch((errorMessage) => {
    core.setFailed(errorMessage);
  });
