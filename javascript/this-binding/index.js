// Run:  node javascript/this-binding/index.js
'use strict';

const user = {
  name: 'Ada',
  greet() { return `Hi, I'm ${this.name}`; },
};

// --- implicit binding: this = object left of the dot ---
console.log(user.greet());          // Hi, I'm Ada

// --- losing this: bare reference strips the binding ---
const loose = user.greet;
try { loose(); }                    // this is undefined in strict mode
catch (e) { console.log('lost this:', e.constructor.name); } // TypeError

// --- explicit binding: call / apply / bind ---
function intro(greeting, punct) { return `${greeting}, ${this.name}${punct}`; }
console.log(intro.call(user, 'Hello', '!'));   // Hello, Ada!
console.log(intro.apply(user, ['Hey', '.']));  // Hey, Ada.
const bound = intro.bind(user, 'Yo');
console.log(bound('?'));                        // Yo, Ada?

// --- new binding: this = the freshly created object ---
function Animal(type) { this.type = type; }
const cat = new Animal('cat');
console.log(cat.type);              // cat

// --- arrow functions capture lexical this; bind can't change them ---
const counter = {
  count: 0,
  startBad() { return (function () { return this; })(); }, // plain call -> undefined
  startGood() { return (() => this.count)(); },            // arrow -> lexical this = counter
};
counter.count = 5;
console.log(counter.startGood());   // 5  (arrow used counter's this)
console.log(counter.startBad());    // undefined (lost this)

// --- arrow ignores bind ---
const arrow = () => (typeof this);  // module scope
console.log(arrow.call({ x: 1 }) === arrow()); // true (bind/call had no effect)
