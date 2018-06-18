'use strict';
const ARRP = require(__dirname + '/arrp.js');
const arrpNodeBuiltins = require(__dirname + '/src/arrp-node-builtins.js');
const fs = require('fs');

const arrp = new ARRP(arrpNodeBuiltins);

let filepath = process.argv[2];
let content = fs.readFileSync(filepath, 'utf-8');
let stackOrNull = arrp.read(content);
let result = arrp.evalFromStack(stackOrNull);
process.exit();
