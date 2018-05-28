'use strict';
class ArrpSpecial {
  constructor(callable) {
    this.callable = callable;
  }

  call (evaluator, args) {
    args.unshift(evaluator);
    return this.callable.apply(null, args);
  }

  toString() {
    return "Special";
  }
}

module.exports = ArrpSpecial;
