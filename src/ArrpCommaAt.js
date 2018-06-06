'use strict';
const ArrpExpandedValues = require(__dirname + '/ArrpExpandedValues.js');

class ArrpCommaAt {
  constructor(sexp) {
    this.sexp = sexp;
  }

  toString() {
    if (this.sexp instanceof Array) {
      return ',@[' + this.sexp.join(', ') + ']'; // TODO
    }
    return ',@' + String(this.sexp); // TODO
  }
  inspect() {
    return this.toString();
  }

  static make(sexp) {
    if (sexp instanceof ArrpExpandedValues) {
      return new ArrpExpandedValues(sexp.values.map((val) =>  new ArrpCommaAt(val)));
    }
    return new ArrpCommaAt(sexp);

  }
}

module.exports = ArrpCommaAt;
