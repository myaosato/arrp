'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');
let arrpPrint = (sexp) => {
  if (sexp instanceof Array) {
    if (sexp[0] instanceof ArrpSymbol){
      if (sexp[0].identifier === 'quote') return "'" + arrpPrint(sexp[1]);
      if (sexp[0].identifier === 'quasi-quote') return "`" + arrpPrint(sexp[1]);
    }
    return "(" + sexp.map((elt) => arrpPrint(elt)).join(' ') + ")";
  } else {
    return sexp.toString();
  }
};
module.exports = arrpPrint;
