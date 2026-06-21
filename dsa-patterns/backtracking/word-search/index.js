// Run:  node dsa-patterns/backtracking/word-search/index.js

// DFS + backtracking. From each cell try to match the word char by char,
// moving to the 4 neighbours. Mark a cell as visited by temporarily mutating
// it, then restore it on the way back so other paths can reuse it.
function exist(board, word) {
  const rows = board.length;
  const cols = board[0].length;

  function dfs(r, c, idx) {
    if (idx === word.length) return true;            // matched whole word
    if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
    if (board[r][c] !== word[idx]) return false;     // char mismatch

    const saved = board[r][c];
    board[r][c] = '#'; // mark visited so we don't reuse this cell

    const found =
      dfs(r + 1, c, idx + 1) ||
      dfs(r - 1, c, idx + 1) ||
      dfs(r, c + 1, idx + 1) ||
      dfs(r, c - 1, idx + 1);

    board[r][c] = saved; // restore (backtrack)
    return found;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}

// Demo
const board = [
  ['A', 'B', 'C', 'E'],
  ['S', 'F', 'C', 'S'],
  ['A', 'D', 'E', 'E'],
];
console.log(exist(board, 'ABCCED')); // true
console.log(exist(board, 'SEE'));    // true
console.log(exist(board, 'ABCB'));   // false (cell B cannot be reused)
