// Run:  node dsa-problems/trees/validate-bst/index.js

class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val; this.left = left; this.right = right;
  }
}

// Sample tree (a valid BST):
//         4
//       /   \
//      2     6
//     / \   / \
//    1   3 5   7
function buildSampleTree() {
  return new TreeNode(4,
    new TreeNode(2, new TreeNode(1), new TreeNode(3)),
    new TreeNode(6, new TreeNode(5), new TreeNode(7)));
}

// Validate BST: every node within (min, max) bounds. O(n) time, O(h) space.
function isValidBST(node, min = -Infinity, max = Infinity) {
  if (!node) return true;
  if (node.val <= min || node.val >= max) return false;   // out of allowed range
  return isValidBST(node.left, min, node.val)             // left subtree < node
    && isValidBST(node.right, node.val, max);             // right subtree > node
}

const root = buildSampleTree();
console.log('Valid BST   ->', isValidBST(root)); // true
const badBST = new TreeNode(5, new TreeNode(1), new TreeNode(4, new TreeNode(3), new TreeNode(6)));
console.log('Invalid tree ->', isValidBST(badBST)); // false
