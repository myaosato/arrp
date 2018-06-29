'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');

class ArrpJsMethod {
  constructor(source) {
    if (source instanceof Function) {
      this.identifier = source.name;
    } else if (source instanceof ArrpSymbol) {
      this.identifier = source.identifier;
    } else if (source instanceof ArrpJsMethod) {
      this.identifier = source.identifier;
    } else if (typeof source === 'string'){
      this.identifier = source;
    } else {
      this.identifier = null; // TODO
    }
  }
}

module.exports = ArrpJsMethod;
