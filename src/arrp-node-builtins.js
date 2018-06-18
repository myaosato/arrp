const fs = require('fs');
const arrpPrint = require(__dirname + '/arrp-print.js');
const arrpNodeBuiltins = new Map();
arrpNodeBuiltins.set('exit', () => {process.exit();});
arrpNodeBuiltins.set('print-s', (sexp) => {console.log(arrpPrint(sexp))});
arrpNodeBuiltins.set('read-file', (...args) => fs.readFileSync.apply(fs, args));

module.exports = arrpNodeBuiltins;
