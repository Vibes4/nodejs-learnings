// Run:  node javascript/array-methods/index.js

const nums = [1, 2, 3, 4, 5];

// --- map / filter / reduce ---
console.log(nums.map(n => n * 2));            // [ 2, 4, 6, 8, 10 ]
console.log(nums.filter(n => n % 2 === 0));   // [ 2, 4 ]
console.log(nums.reduce((sum, n) => sum + n, 0)); // 15 (always pass the seed)

// group with reduce -> object
const words = ['apple', 'ant', 'bear'];
const byLetter = words.reduce((acc, w) => {
  (acc[w[0]] ||= []).push(w);
  return acc;
}, {});
console.log(byLetter);                         // { a: [ 'apple', 'ant' ], b: [ 'bear' ] }

// --- find / some / every (short-circuit) ---
console.log(nums.find(n => n > 3));            // 4
console.log(nums.some(n => n > 4));            // true
console.log(nums.every(n => n > 0));           // true

// --- spread & rest ---
const more = [...nums, 6];                     // spread: expand
console.log(more);                             // [ 1, 2, 3, 4, 5, 6 ]
const [head, ...tail] = nums;                  // rest: collect
console.log(head, tail);                       // 1 [ 2, 3, 4, 5 ]

// --- destructuring with defaults & rename ---
const user = { id: 7, role: 'admin' };
const { id, name = 'anon', role: r } = user;
console.log(id, name, r);                      // 7 anon admin

// --- Object.keys / values / entries / fromEntries ---
console.log(Object.keys(user));                // [ 'id', 'role' ]
console.log(Object.values(user));              // [ 7, 'admin' ]
const upper = Object.fromEntries(
  Object.entries(user).map(([k, v]) => [k, String(v).toUpperCase()])
);
console.log(upper);                            // { id: '7', role: 'ADMIN' }

// --- immutability: never mutate the original ---
const updated = { ...user, role: 'editor' };   // new object
console.log(user.role, updated.role);          // admin editor
const sorted = [...nums].sort((a, b) => b - a); // copy before sorting
console.log(sorted, nums);                      // [5,4,3,2,1] [1,2,3,4,5] (original intact)
