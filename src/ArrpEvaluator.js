'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');
const ArrpComma = require(__dirname + '/ArrpComma.js');
const ArrpFunction = require(__dirname + '/ArrpFunction.js');
const ArrpMacro = require(__dirname + '/ArrpMacro.js');
const ArrpSpecial = require(__dirname + '/ArrpSpecial.js');
const ArrpJsMethod = require(__dirname + '/ArrpJsMethod.js');
const ReturnFromFunctionError = require(__dirname + '/ReturnFromFunctionError.js');
const ArrpMultipleValue = require(__dirname + '/ArrpMultipleValue.js');


class ArrpEvaluator{
  constructor(env) {
      this.env = env;
      this.quasiQuoteCounter = 0;
      this.commaCounter = 0;
      this.envsForTco = null;
      this.sexpForTco = null;
  }

  __getSingleValue(val){
    if (val instanceof ArrpMultipleValue) return val.top();
    return val;
  }

  call(op, args) {
    while (true) {
      if (op instanceof Function) {
        return op.apply(null, args.map((arg) => this.__getSingleValue(this.eval(arg))));
      } else if (op instanceof ArrpJsMethod) {
        let a = args.map((arg) => this.__getSingleValue(this.eval(arg)));
        return a[0][op.identifier].apply(a[0], a.slice(1));
      } else if (op instanceof ArrpSpecial) {
        return op.call(this, args);
      } else if (op instanceof ArrpFunction) {
        try {
          if (this.envsForTco === null) {
            return op.call(this, args.map((arg) => this.__getSingleValue(this.eval(arg))));
          } else {
            this.env.enter(this.envsForTco);
            try {
              args = this.sexpForTco.slice(1);
              return op.call(this, args.map((arg) => this.__getSingleValue(this.eval(arg))));
            } finally {
              this.env.exit();
              this.sexpForTco = null;
              this.envsForTco = null;
            }
          }
        } catch (error) {
          if (error instanceof ReturnFromFunctionError){
            if (error.sexp instanceof Array && error.sexp.length > 0){
              this.env.enter(error.envs);
              try {
                op = this.eval(error.sexp[0]);
              } finally {
                this.env.exit();
              }
              this.sexpForTco = error.sexp;
              this.envsForTco = error.envs;
              continue;
            } else {
              return this.eval(error.sexp);
            }
          }
          throw error;
        }
      } else if (op instanceof ArrpMacro) {
        return this.eval(op.expand(this, args));
      } else {
        return null; // TODO Error
      }
    }
  }

  eval(sexp) {
    try {
      if (typeof sexp === 'string' || typeof sexp === 'number') {
        return sexp;
      } else if (sexp === undefined || sexp === null) {
        return sexp;
      } else if (sexp instanceof Boolean) {
        return sexp;
      } else if (sexp === Infinity) {
        return sexp;
      } else if (sexp instanceof ArrpSymbol) {
        if (typeof sexp.identifier === 'symbol') return this.env.get(sexp);
        if ((new RegExp(/^js:/, 'i')).test(sexp.identifier)) {
          return new ArrpJsMethod(sexp.identifier.slice(3));
        }
        return this.env.get(sexp);
      } else if (sexp instanceof Array) {
        if (sexp.length === 0) {
          return sexp;
        } else {
          return this.call(this.eval(sexp[0]), sexp.slice(1));
        }
      }
      return sexp;
    } catch (error) {
      let len = this.env.lexicalEnvsStack.length;
      for (let count = 0; count < len; count++) {
        this.env.exit();
      }
      throw error;
    }
  }

  evalFromStack(sexps) {
    try {
      if (sexps.stack.length === 0) return '#<No Input>'; //TODO
      let tmp = undefined; // TODO
      while (true) {
        let sexp = sexps.dequeue();
        if (sexp === undefined) break;
        tmp = this.eval(sexp);
      }
      return tmp;
    } catch (error) {
      return new ArrpMultipleValue(null, error);
    }

  }
}

module.exports = ArrpEvaluator;
