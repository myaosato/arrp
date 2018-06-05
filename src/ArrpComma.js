'use strict';

class ArrpComma {
  constructor(sexp) {
    this.sexp = sexp;
  }

  toString() {
    if (this.sexp instanceof Array) {
      return ',[' + this.sexp.join(', ') + ']'; // TODO
    }
    return ',' + String(this.sexp); // TODO
  }
  inspect() {
    return this.toString();
  }

  static make(sexp) {
    return new ArrpComma(sexp);
  }
}

module.exports = ArrpComma;
