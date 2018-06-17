'use strict';
const ArrpExpandedValues = require(__dirname + '/ArrpExpandedValues.js');
const arrpPrint = require(__dirname + '/arrp-print.js');
class ArrpComma {
  constructor(sexp) {
    this.sexp = sexp;
  }

  toString() {
    return ',' + arrpPrint(this.sexp);
  }
  inspect() {
    return this.toString();
  }

  static make(sexp) {
    if (sexp instanceof ArrpExpandedValues) {
      return new ArrpExpandedValues(sexp.values.map((val) =>  new ArrpComma(val)));
    }
    return new ArrpComma(sexp);
  }
}

module.exports = ArrpComma;
