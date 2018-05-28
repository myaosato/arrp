'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');

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
      let result = evaluator.eval(this.body);
      evaluator.env.exit();
      return result;
    }
}

module.exports = ArrpFunction;
