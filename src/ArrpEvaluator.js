'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');
const ArrpFunction = require(__dirname + '/ArrpFunction.js');
const ArrpMacro = require(__dirname + '/ArrpMacro.js');
const ArrpSpecial = require(__dirname + '/ArrpSpecial.js');
const ArrpMultipleValue = require(__dirname + '/ArrpMultipleValue.js');

class ArrpEvaluator{
  constructor(env) {
      this.env = env;
  }

  call(op, args) {
    if (op instanceof Function) {
      return op.apply(null, args.map((arg) => this.eval(arg)));
    } else if (op instanceof ArrpSpecial) {
      return op.call(this, args);
    } else if (op instanceof ArrpFunction) {
      return op.call(this, args.map((arg) => this.eval(arg)));
    } else if (op instanceof ArrpMacro) {
      return; // TODO WIP
    }
    return null; // TODO Error
  }

  eval(sexp, multipleMode = false) {
    let val = this.__eval(sexp);
    if (multipleMode) {
      return val;
    } else {
      if (val instanceof ArrpMultipleValue) return val.top();
      return val;
    }
  }

  __eval(sexp) {
    if (typeof sexp === 'string' || typeof sexp === 'number') {
      return sexp;
    } else if (sexp === undefined || sexp === null) {
      return sexp;
    } else if (sexp instanceof Boolean) {
      return sexp;
    } else if (sexp === Infinity) {
      return sexp;
    } else if (sexp instanceof ArrpSymbol) {
      return this.env.get(sexp);
    } else if (sexp instanceof Array) {
      if (sexp.length === 0) {
        return sexp;
      } else {
        return this.call(this.eval(sexp[0]), sexp.slice(1));
      }
    }
    return sexp;
  }

  evalFromStack(sexps, multiple) {
    if (sexps.stack.length === 0) return '#<No Input>'; //TODO
    let tmp = undefined; // TODO
    while (true) {
      let sexp = sexps.dequeue();
      if (sexp === undefined) break;
      tmp = this.eval(sexp, multiple);
    }
    return tmp;
  }
}

module.exports = ArrpEvaluator;
