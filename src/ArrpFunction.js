'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');
const ReturnFromFunctionError = require(__dirname + '/ReturnFromFunctionError.js');

class ArrpFunction {
    constructor (env, params, body) {
      this.env = env.getLexialEnv();
      this.params = params;
      body.unshift(ArrpSymbol.make('progn'));
      this.body = body;
    }

    bind (env, args) {
      this.params.forEach((sym, ind) => {
        env.set(sym, args[ind]);
      });
    }

    call(evaluator, args) {

      evaluator.env.enter(this.env);
      this.bind(evaluator.env, args);
      let result;
      try {
        result = evaluator.eval(this.body);
        evaluator.env.exit();
      } catch (error) {
        if (error instanceof ReturnFromFunctionError) {
          return error.val;
        }
        throw error;
      }
      return result;
    }

    toString() {
      return '#<Arrp Function>';
    }

    inspect() {
      return this.toString();
    }
}

module.exports = ArrpFunction;
