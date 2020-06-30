export function getBaseTagNode(branchName) {
  return {
    name: `tags/${branchName}-000`,
    target: { oid: null },
  };
}

export const zeroPad = (num, places) => String(num).padStart(places, "0");

exports.getBaseTagNode = getBaseTagNode;
exports.zeroPad = zeroPad;
