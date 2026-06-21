// Run:  node dsa-patterns/tree-bfs/level-order/index.js

class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// Build a tree from a level-order array (LeetCode style), using null for gaps.
function buildTree(arr) {
  if (arr.length === 0 || arr[0] == null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length) {
      if (arr[i] != null) { node.left = new TreeNode(arr[i]); queue.push(node.left); }
      i++;
    }
    if (i < arr.length) {
      if (arr[i] != null) { node.right = new TreeNode(arr[i]); queue.push(node.right); }
      i++;
    }
  }
  return root;
}

// BFS: process the queue one full level at a time, recording each level's values.
function levelOrder(root) {
  const result = [];
  if (!root) return result;
  const queue = [root];
  while (queue.length) {
    const levelSize = queue.length;
    const level = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}

// Demo
const root = buildTree([3, 9, 20, null, null, 15, 7]);
console.log(levelOrder(root));
// [ [ 3 ], [ 9, 20 ], [ 15, 7 ] ]
