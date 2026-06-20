// Run:  node javascript/scope-hoisting/index.js

// --- function declarations are fully hoisted ---
console.log(add(2, 3));            // 5  (callable before its definition)
function add(a, b) { return a + b; }

// --- var is hoisted and initialised to undefined ---
console.log(hoistedVar);           // undefined (not a ReferenceError)
var hoistedVar = 'set later';
console.log(hoistedVar);           // 'set later'

// --- let/const live in the Temporal Dead Zone until declared ---
try {
  console.log(notYet);             // throws: Cannot access before initialization
  let notYet = 1;
} catch (e) {
  console.log('TDZ:', e.constructor.name); // TDZ: ReferenceError
}

// --- var ignores blocks (function-scoped); let respects them ---
function scopeDemo() {
  if (true) {
    var leaks = 'visible outside the if';
    let blocked = 'only inside the if';
  }
  console.log(leaks);              // works: var leaked to function scope
  try { console.log(blocked); }
  catch (e) { console.log('let blocked:', e.constructor.name); } // ReferenceError
}
scopeDemo();

// --- per-iteration binding: let vs var in a loop ---
const withLet = [];
for (let i = 0; i < 3; i++) withLet.push(() => i);
console.log(withLet.map(f => f())); // [0, 1, 2]  fresh binding each iteration

const withVar = [];
for (var j = 0; j < 3; j++) withVar.push(() => j);
console.log(withVar.map(f => f())); // [3, 3, 3]  one shared binding
