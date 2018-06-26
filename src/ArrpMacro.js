'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');
const ArrpCallable = require(__dirname + '/ArrpCallable.js');

class ArrpMacro extends ArrpCallable{
  constructor (env, paramSexp, body) {
    super();
    this.envs = env.getLexicalEnvs();
    this.params = this.__setParams(paramSexp);
    body.unshift(ArrpSymbol.make('progn'));
    this.body = body;
  }

  expand(evaluator, args) {
    evaluator.env.enter(this.envs);
    try {
      this.bind(evaluator.env, args);
      return evaluator.eval(this.body);
    } finally {
      evaluator.env.exit();
    }
  }

  toString() {
    return '#<Arrp Macro>';
  }

  inspect() {
    return this.toString();
  }

}

module.exports = ArrpMacro;
