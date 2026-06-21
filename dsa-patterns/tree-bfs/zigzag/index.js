// Run:  node dsa-patterns/tree-bfs/zigzag/index.js

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

// Standard level-order BFS, but flip a direction flag each level. On
// right-to-left levels, prepend values (unshift) so the row reads backwards.
function zigzagLevelOrder(root) {
  const result = [];
  if (!root) return result;
  const queue = [root];
  let leftToRight = true;
  while (queue.length) {
    const levelSize = queue.length;
    const level = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      if (leftToRight) level.push(node.val);
      else level.unshift(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
    leftToRight = !leftToRight;
  }
  return result;
}

// Demo
const root = buildTree([3, 9, 20, null, null, 15, 7]);
console.log(zigzagLevelOrder(root));
// [ [ 3 ], [ 20, 9 ], [ 15, 7 ] ]
