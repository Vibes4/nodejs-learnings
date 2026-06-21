// Run:  node dsa-problems/trees/level-order/index.js

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

// Level-order BFS: group nodes by depth using a queue. O(n) time, O(n) space.
function levelOrder(root) {
  if (!root) return [];
  const levels = [], queue = [root];
  while (queue.length) {
    const level = [], size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    levels.push(level);
  }
  return levels;
}

const root = buildSampleTree();
console.log('Level order (BFS):', JSON.stringify(levelOrder(root))); // [[4],[2,6],[1,3,5,7]]
