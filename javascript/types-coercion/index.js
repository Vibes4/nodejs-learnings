// Run:  node javascript/types-coercion/index.js

// --- typeof quirks ---
console.log(typeof null);        // 'object'  (historical bug)
console.log(typeof NaN);         // 'number'  (NaN is a numeric value)
console.log(typeof []);          // 'object'  -> use Array.isArray()
console.log(typeof function(){});// 'function'

// --- primitives compared by value, objects by reference ---
console.log(1 === 1);            // true
console.log({} === {});          // false (two different references)
const obj = {};
console.log(obj === obj);        // true  (same reference)

// --- == coercion landmines (non-transitive!) ---
console.log('' == 0);            // true
console.log(0 == '0');           // true
console.log('' == '0');          // false  <- breaks transitivity
console.log([] == false);        // true   ([] -> '' -> 0, false -> 0)
console.log(null == undefined);  // true
console.log(null === undefined); // false

// --- falsy values: exactly these 8 ---
const falsy = [false, 0, -0, 0n, '', null, undefined, NaN];
console.log(falsy.every(v => !v)); // true (all falsy)
console.log(!![], !!{}, !!'0');    // true true true (truthy)

// --- NaN checks ---
console.log(NaN === NaN);          // false (never equal to itself)
console.log(Number.isNaN(NaN));    // true
console.log(isNaN('abc'));         // true  (global coerces -> bad)
console.log(Number.isNaN('abc'));  // false (no coercion -> correct)

// --- Object.is: SameValue ---
console.log(Object.is(NaN, NaN));  // true  (unlike ===)
console.log(Object.is(0, -0));     // false (unlike ===)
console.log(0 === -0);             // true
