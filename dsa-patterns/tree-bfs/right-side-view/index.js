// Run:  node dsa-patterns/tree-bfs/right-side-view/index.js

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

// BFS level by level; the last node dequeued in each level is the one visible
// from the right side.
function rightSideView(root) {
  const result = [];
  if (!root) return result;
  const queue = [root];
  while (queue.length) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      if (i === levelSize - 1) result.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return result;
}

// Demo
const root = buildTree([1, 2, 3, null, 5, null, 4]);
console.log(rightSideView(root));
// [ 1, 3, 4 ]
