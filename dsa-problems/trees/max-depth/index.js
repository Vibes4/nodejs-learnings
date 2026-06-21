// Run:  node dsa-problems/trees/max-depth/index.js

class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val; this.left = left; this.right = right;
  }
}

// Sample tree:
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

// Max depth: O(n) time, O(h) space.
function maxDepth(node) {
  if (!node) return 0;
  return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));
}

const root = buildSampleTree();
console.log('Max depth:', maxDepth(root)); // 3
