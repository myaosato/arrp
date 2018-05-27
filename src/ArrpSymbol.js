'use strict';

class ArrpSymbol {
  constructor(str) {
    this.str = str;
  }

  toString() {
    return `Symbol#<${this.str}>`;
  }
  inspect() {
    return this.toString();
  }

  eq(sym) {
    return this.str === sym.str;
  }

  static make(str) {
    return new ArrpSymbol(str);
  }
}

module.exports = ArrpSymbol;
