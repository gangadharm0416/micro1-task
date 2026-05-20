# Security Ticket: Prototype Pollution in deep-path setters

**Severity:** High
**Component:** `lodash.js` — `_.set`, `_.setWith`, `_.zipObjectDeep`, `_.update`, `_.updateWith`

A user-supplied path string can mutate `Object.prototype`. PoC:

```js
const _ = require('./lodash.js');
_.zipObjectDeep(['a.__proto__.polluted'], [true]);
console.log(({}).polluted); // observed: true
```

`zipObjectDeep` is not the only sink — these APIs share an internal path-walking helper.

## Task

1. Harden the affected code so no public deep-path setter can write through
   `Object.prototype`, `Function.prototype`, or `Array.prototype` — whether the
   path is given as a string (`"a.__proto__.x"`), an array
   (`["a","__proto__","x"]`), or via `constructor.prototype`.
2. Preserve existing behavior of `_.set`, `_.setWith`, `_.zipObjectDeep`,
   `_.update`, and `_.updateWith` on benign paths.

## Done when

- The PoC no longer pollutes `Object.prototype`.
- `npm test` still passes.

Do not edit anything under `test/`.
