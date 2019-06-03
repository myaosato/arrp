'use strict';

class ArrpSymbol {
  constructor(identifier) {
    this.identifier = identifier;
  }

  toString() {
    if (typeof this.identifier === 'symbol') return '#<gensym-' + this.identifier.toString().slice(7, -1) + '>';
    return `${this.identifier}`;
  }
  inspect() {
    return this.toString();
  }

  name() {
    if (typeof this.identifier === 'symbol') return this.identifier.toString();
    if (this.identifier.indexOf(':') === -1){
      return this.identifier;
    } else {
      return this.identifier.slice(this.identifier.indexOf(':') + 1);
    }
  }

  eq(sym) {
    return this.identifier === sym.identifier;
  }

  static make(str) {
    return new ArrpSymbol(str);
  }
}

module.exports = ArrpSymbol;
