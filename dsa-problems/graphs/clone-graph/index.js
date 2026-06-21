// Run:  node dsa-problems/graphs/clone-graph/index.js

class GraphNode {
  constructor(val) { this.val = val; this.neighbors = []; }
}

// Clone Graph: DFS with visited Map of original -> clone. O(V + E) time, O(V) space.
function cloneGraph(node, visited = new Map()) {
  if (!node) return null;
  if (visited.has(node)) return visited.get(node);   // already cloned -> reuse
  const copy = new GraphNode(node.val);
  visited.set(node, copy);                           // record before recursing (handles cycles)
  for (const nb of node.neighbors) {
    copy.neighbors.push(cloneGraph(nb, visited));
  }
  return copy;
}

// Structural equality check (different objects, same shape) for the demo.
function sameStructure(a, b, seen = new Set()) {
  if (a === b) return false;                          // must be distinct objects
  if (!a || !b || a.val !== b.val) return false;
  if (a.neighbors.length !== b.neighbors.length) return false;
  if (seen.has(a)) return true;
  seen.add(a);
  return a.neighbors.every((nb, i) => sameStructure(nb, b.neighbors[i], seen));
}

// Build a tiny graph: 1-2, 1-3, 2-4 (undirected, with a cycle 1<->2).
const g1 = new GraphNode(1), g2 = new GraphNode(2), g3 = new GraphNode(3), g4 = new GraphNode(4);
g1.neighbors = [g2, g3];
g2.neighbors = [g1, g4];
g3.neighbors = [g1];
g4.neighbors = [g2];

const cloned = cloneGraph(g1);
console.log('clone is a different object ->', cloned !== g1);          // true
console.log('clone is structurally equal ->', sameStructure(g1, cloned)); // true
