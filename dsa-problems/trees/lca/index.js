// Run:  node dsa-problems/trees/lca/index.js

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

// Lowest Common Ancestor (general BINARY TREE): node where p and q split. O(n) time, O(h) space.
function lowestCommonAncestor(node, p, q) {
  if (!node || node === p || node === q) return node;   // hit a target or dead end
  const left = lowestCommonAncestor(node.left, p, q);
  const right = lowestCommonAncestor(node.right, p, q);
  if (left && right) return node;                       // p and q on opposite sides
  return left || right;                                 // both on one side (or neither)
}

const root = buildSampleTree();
console.log('LCA(1, 3) ->', lowestCommonAncestor(root, root.left.left, root.left.right).val);  // 2
console.log('LCA(1, 7) ->', lowestCommonAncestor(root, root.left.left, root.right.right).val); // 4
