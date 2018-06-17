'use strict';
const ARRP = require(__dirname + '/arrp.js');

const arrpRunBuiltins = new Map();
arrpRunBuiltins.set('exit', () => {process.exit();});
arrpRunBuiltins.set('print-s', (sexp) => {console.log(arrp.print(sexp))});

const arrp = new ARRP(arrpRunBuiltins);

let filepath = process.argv[2];
let content = require('fs').readFileSync(filepath, 'utf-8');
let stackOrNull = arrp.read(content);
let result = arrp.evalFromStack(stackOrNull);
process.exit();
