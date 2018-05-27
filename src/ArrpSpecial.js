'use strict';
class ArrpSpecial {
  constructor(callable) {
    this.callable = callable;
  }

  call (env, arrpEval, args) {
    args.unshift(arrpEval);
    args.unshift(env);
    return this.callable.apply(null, args);
  }

  toString() {
    return "Special";
  }
}

module.exports = ArrpSpecial;
