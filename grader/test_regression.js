#!/usr/bin/env node
// Benign behavior must still work. Catches over-broad fixes
// (e.g. blocking any path segment containing "proto").
'use strict';
const assert = require('assert');
const path = require('path');
const _ = require(path.join(process.argv[2] || '/work/lodash', 'lodash.js'));

let fails = 0;
const check = (name, fn) => {
  try { fn(); console.log(`ok   ${name}`); }
  catch (e) { console.log(`FAIL ${name}: ${e.message}`); fails++; }
};

check('set creates intermediates',         () => { const o = {}; _.set(o, 'a.b.c', 42); assert.strictEqual(o.a.b.c, 42); });
check('set creates array for numeric idx', () => { const o = {}; _.set(o, 'a[0].b', 'x'); assert.strictEqual(o.a[0].b, 'x'); });
check('zipObjectDeep benign keys',         () => assert.deepStrictEqual(_.zipObjectDeep(['a.b','a.c'], [1,2]), {a:{b:1,c:2}}));
check('benign key named "proto" works',    () => { const o = {}; _.set(o, 'a.proto.x', 1); assert.strictEqual(o.a.proto.x, 1); });
check('update applies updater',            () => { const o = {a:{b:1}}; _.update(o, 'a.b', v => v + 1); assert.strictEqual(o.a.b, 2); });

process.exit(fails ? 1 : 0);
