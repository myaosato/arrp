'use strict';

class ArrpComma {
  constructor(sexp) {
    this.sexp = sexp;
  }

  toString() {
    return '<Comma>';
  }
  inspect() {
    return this.toString();
  }

  static make(sexp) {
    return new ArrpComma(sexp);
  }
}

module.exports = ArrpComma;
