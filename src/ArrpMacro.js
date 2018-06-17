'use strict';
const ArrpSymbol = require(__dirname + '/ArrpSymbol.js');
const ArrpCallable = require(__dirname + '/ArrpCallable.js');

class ArrpMacro extends ArrpCallable{
  constructor (env, paramSexp, body) {
    super();
    this.env = env.getLexialEnv();
    this.params = this.__setParams(paramSexp);
    body.unshift(ArrpSymbol.make('progn'));
    this.body = body;
  }

  expand(evaluator, args) {
    evaluator.env.enter(this.env);
    this.bind(evaluator.env, args);
    let result = evaluator.eval(this.body);
    evaluator.env.exit();
    return result;
  }

  toString() {
    return '#<Arrp Macro>';
  }

  inspect() {
    return this.toString();
  }

}

module.exports = ArrpMacro;
