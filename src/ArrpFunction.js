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

    call(env, arrpEval, args) {
      env.enter(this.env);
      this.bind(env, args);
      let result = arrpEval(this.body);
      env.exit();
      return result;
    }
}

module.exports = ArrpFunction;
