'use strict';
class ArrpJsMethod {
  constructor(source) {
    if (source instanceof Function) {
      this.identifier = source.name;
    } else {
      this.identifier = String(source);
    }
  }
}

module.exports = ArrpJsMethod;
