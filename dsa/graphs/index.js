// Run:  node dsa/graphs/index.js
// Adjacency-list DFS + BFS, plus Number of Islands on a grid.

const graph = {
  A: ['B', 'C'], B: ['A', 'D'], C: ['A', 'D', 'E'], D: ['B', 'C'], E: ['C'],
};

// DFS: O(V + E). Recursion with a visited set.
function dfs(graph, start, visited = new Set(), order = []) {
  visited.add(start);
  order.push(start);
  for (const next of graph[start]) {
    if (!visited.has(next)) dfs(graph, next, visited, order);
  }
  return order;
}

// BFS: O(V + E). Mark visited on enqueue.
function bfs(graph, start) {
  const visited = new Set([start]), order = [], queue = [start];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const next of graph[node]) {
      if (!visited.has(next)) { visited.add(next); queue.push(next); }
    }
  }
  return order;
}

// Number of Islands: flood-fill each landmass. O(rows * cols).
function numIslands(grid) {
  let count = 0;
  const sink = (r, c) => {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] !== '1') return;
    grid[r][c] = '0';                       // mark visited
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  };
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '1') { count++; sink(r, c); }
    }
  }
  return count;
}

console.log('DFS from A:', dfs(graph, 'A').join(' -> '));
console.log('BFS from A:', bfs(graph, 'A').join(' -> '));

const grid = [
  ['1', '1', '0', '0'],
  ['1', '0', '0', '1'],
  ['0', '0', '1', '1'],
];
console.log('\nNumber of Islands:', numIslands(grid)); // 2
