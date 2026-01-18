---
title: Truthy and Falsy values and logical operators in JavaScript
date: '2020-01-06'
spoiler: Everything either truthy or falsy
cta: 'javascript'
---

Essentially values either can be truthy or falsy rely on how they are evaluated in a Boolean environment. An algebraic notation system used to represent logical propositions through binary numbers 0 (false) and 1 (true).


![Sweet truthy falsy banner”](./truthy-falsy.png)

---

## Falsy Values
There are 6 falsy values in JavaScript, which means that when a boolean is expected in JavaScript and it is given of whichever the values which will be stated below, it will always evaluate as falsy.
To be more clear, those 6 falsy values that are coerced to false, are used in if block;

```js
if (false) {/*entered?*/}
if (null) {/*entered?*/}
if (undefined) {/*entered?*/}
if (0) {/*entered?*/}
if (0n) {/*entered?*/}
if (NaN) {/*entered?*/}
if ('') {/*entered?*/}
if ("") {/*entered?*/}
if (``) {/*entered?*/}
```

* `0`, `0n` are counted one and '', "", `` are counted one.


### The logical AND (&&) operator
In a logical statement && means, if the first object is falsy, the statement will return **that object**.

```js
let osman = false && "human";
// ↪ false
```
Other values can be considered truthy.

## Truthy Values

On the other hand, several truthy values can be specified as an example to truthy values in JavaScript.
To be more clear, those truthy values that are coerced to true, are executed in if block;

```js
if (true) {/*entered?*/}
if ({}) {/*entered?*/}
if ([]) {/*entered?*/}
if (42) {/*entered?*/}
if ("0") {/*entered?*/}
if ("false") {/*entered?*/}
if (new Date()) {/*entered?*/}
if (-42) {/*entered?*/}
if (12n) {/*entered?*/}
if (3.14) {/*entered?*/}
if (-3.14) {/*entered?*/}
if (Infinity) {/*entered?*/}
if (-Infinity) {/*entered?*/}
```

### The logical OR (||) operator
In a logical statement || means, if the first object is truthy, the statement will return that object, the statement will return the second object otherwise.

```js
let osman = false && "human";
// ↪ "human"
let mahmut = true && "human";
// ↪ true
```

A value's being true or false can be seen by passing it into the Boolean function as below.

```js
Boolean("") // false
Boolean([]) // true
```

### (NOT NOT) !! operator
Using `!` operator once will reverse the boolean value (i.e. true to false, falsa to true). If using ! operator once more will convert it back to a boolean.

```js
Boolean(!"") // true
Boolean(!!"") // false
Boolean(![]) // false
Boolean(!![]) // true
```

Example;
Shortcut for checking a value in if condition, need to log only true or false.

```js
const sulhadin = "human";
console.log(sulhadin); // ↪ "human"
console.log(!sulhadin); // ↪ false
console.log(!!sulhadin); // ↪ true
```

### In Closing

Thanks for reading.


#### Resources
[Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)
[Truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)
