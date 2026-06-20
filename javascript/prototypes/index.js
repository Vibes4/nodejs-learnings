// Run:  node javascript/prototypes/index.js

// --- constructor function + prototype (the old way) ---
function Animal(name) { this.name = name; }
Animal.prototype.speak = function () { return `${this.name} makes a sound`; };

const a = new Animal('Rex');
console.log(a.speak());                        // Rex makes a sound
console.log(a.__proto__ === Animal.prototype); // true (the link)
console.log(Object.getPrototypeOf(a) === Animal.prototype); // true (preferred)

// --- method lookup walks the chain ---
console.log(a.hasOwnProperty('name'));  // true  (own property)
console.log(a.hasOwnProperty('speak')); // false (found on prototype)
console.log('toString' in a);           // true  (from Object.prototype, top of chain)

// --- ES6 class is sugar over the same machinery ---
class Dog extends Animal {
  constructor(name) {
    super(name);                        // must run before using `this`
    this.legs = 4;
  }
  speak() { return `${super.speak()} (woof!)`; } // super calls parent method
}
const d = new Dog('Fido');
console.log(d.speak());                 // Fido makes a sound (woof!)
console.log(d instanceof Animal);       // true (chain links Dog -> Animal)
// methods live on the prototype, not the instance:
console.log(Object.getOwnPropertyNames(Dog.prototype)); // [ 'constructor', 'speak' ]

// --- Object.create: prototypal inheritance, no constructor ---
const proto = { greet() { return `hi from ${this.id}`; } };
const obj = Object.create(proto);
obj.id = 7;
console.log(obj.greet());               // hi from 7

// --- Object.create(null): bare dictionary, no inherited props ---
const dict = Object.create(null);
dict.key = 'value';
console.log(dict.toString);             // undefined (no Object.prototype)
